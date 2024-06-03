using Models;
using System;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using UnitOfWork;

namespace Repositorys
{
    public class DelicatessenOrderRepository : IDelicatessenOrderRepository, IDisposable
    {
        private readonly ApplicationDbContext _context;
        private bool disposed = false;

        public DelicatessenOrderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public IQueryable<DelicatessenOrder> Where(Expression<Func<DelicatessenOrder, bool>> expression)
        {
            return _context.DelicatessenOrder.Include(x => x.Coupon)
                 .Include(x => x.DelicatessenOrderTrackings).ThenInclude(x => x.StatusOrder)
                .Where(expression);
        }

        public DelicatessenOrder Get(int id)
        {
            return _context.DelicatessenOrder
                .Include(x => x.PaymentCondition)
                .Include(x => x.Coupon)
                .Include(x => x.EstablishmentBrandCredit).ThenInclude(x => x.Brand)
                .Include(x => x.EstablishmentBrandDebit).ThenInclude(x => x.Brand)
                .Include(x => x.DelicatessenOrderProducts).ThenInclude(x => x.DelicatessenProduct)
                .Include(x => x.DelicatessenOrderTrackings).ThenInclude(x => x.StatusOrder)
                .FirstOrDefault(x => x.Id == id);
        }

        public void Insert(DelicatessenOrder entity)
        {
            decimal total = 0;
            var establishment = _context.Establishment.FirstOrDefault(e => e.Id == entity.EstablishmentId);
            if (establishment != null)
            {
                if (establishment.MinimumValue.HasValue)
                {
                    if (entity.TaxValue.HasValue)
                    {
                        total = entity.DelicatessenOrderProducts.Sum(x => x.Value * x.Quantity) + entity.TaxValue.Value;
                    } else
                    {
                        total = entity.DelicatessenOrderProducts.Sum(x => x.Value * x.Quantity);
                    }
                    
                    if (establishment.MinimumValue.Value > total) {
                        throw new Exception(string.Concat("Valor mínimo para pedido é de R$ ", establishment.MinimumValue.Value.ToString("#,##0.00")));
                    }
                }
            }

            var b = false;
            var wk = (int)DateTime.Now.DayOfWeek;
            var hourCurrent = new TimeSpan(DateTime.Now.Hour, DateTime.Now.Minute,0);
            var openingHours = _context.OpeningHours
                .Where(o => o.EstablishmentId == entity.EstablishmentId && o.Weekday == wk && o.Active).ToList();

            if (openingHours.Count() == decimal.Zero)
            {
                throw new Exception("Desculpe! Não fazemos entrega no dia de hoje!");
            } else
            {
                openingHours.ForEach(op =>
                {
                    TimeSpan timeSpanStart = new TimeSpan(
                        Convert.ToInt32(op.StartTime.Substring(0, 2)),
                        Convert.ToInt32(op.StartTime.Substring(2, 2)),
                        0);
                    TimeSpan timeSpanEnd = new TimeSpan(
                        Convert.ToInt32(op.EndTime.Substring(0, 2)),
                        Convert.ToInt32(op.EndTime.Substring(2, 2)),
                        0);
                    if (timeSpanStart.CompareTo(hourCurrent) == -1 && timeSpanEnd.CompareTo(hourCurrent) == 1)
                    {
                        b = true;
                    }
                });
            }

            if (b == false)
            {
                throw new Exception("Desculpe! Não fazemos entrega neste horário!");
            }

            entity.DelicatessenOrderEmails.Add(new DelicatessenOrderEmail()
            {
                Send = false,
                TypeEmail = 1
            });
            entity.DelicatessenOrderEmails.Add(new DelicatessenOrderEmail()
            {
                Send = false,
                TypeEmail = 2
            });

            var delicatessenOrderTracking = new DelicatessenOrderTracking();
            delicatessenOrderTracking.FollowupDate = DateTime.Now;
            if (entity.PaymentMoney.HasValue)
            {
                if (entity.PaymentMoney.Value == true)
                {
                    delicatessenOrderTracking.StatusOrderId = 1;
                }
            }
            if (entity.PaymentLittleMachine.HasValue)
            {
                if (entity.PaymentLittleMachine.Value == true)
                {
                    delicatessenOrderTracking.StatusOrderId = 1;
                }
            }
            if (entity.PaymentOnLine.HasValue)
            {
                if (entity.PaymentOnLine.Value == true)
                {
                    delicatessenOrderTracking.StatusOrderId = 2;
                }
            }

            entity.DelicatessenOrderTrackings.Add(delicatessenOrderTracking);
            _context.DelicatessenOrder.Add(entity);
            _context.SaveChanges();
        }

        public IQueryable<DelicatessenOrder> GetByUser(Expression<Func<DelicatessenOrder, bool>> expression)
        {
            return _context.DelicatessenOrder
                .Include(x => x.Coupon)
                .Include(x => x.DelicatessenOrderProducts).ThenInclude(x => x.DelicatessenProduct)
                .Include(x => x.DelicatessenOrderTrackings).ThenInclude(x => x.StatusOrder)
                .Where(expression);
        }

        public DelicatessenOrder GetToPartner(int id)
        {
            var d = _context.DelicatessenOrder.Include(x => x.Coupon)
                .Include(x => x.PaymentCondition)
                .Include(x => x.Address)
                .Include(x => x.EstablishmentBrandCredit).ThenInclude(x => x.Brand)
                .Include(x => x.EstablishmentBrandDebit).ThenInclude(x => x.Brand)
                .Include(x => x.DelicatessenOrderProducts).ThenInclude(x => x.DelicatessenProduct)
                .Include(x => x.DelicatessenOrderTrackings).ThenInclude(x => x.StatusOrder)
                .FirstOrDefault(x => x.Id == id);
            d.ApplicationUserDTO = _context.Users.Where(x => x.Id.Equals(d.ApplicationUserId))
                .Select(cl => new ApplicationUserDTO
                {
                    Cpf = cl.Cpf,
                    Name = cl.UserName,
                    Phone = cl.PhoneNumber,
                    Email = cl.Email
                }).FirstOrDefault();
            return d;
        }

        public void CancelByClient(int id)
        {
            _context.DelicatessenOrderTracking.Add(new DelicatessenOrderTracking()
            {
                FollowupDate = DateTime.Now,
                DelicatessenOrderId = id,
                StatusOrderId = 3
            });

            _context.DelicatessenOrderEmail.Add(new DelicatessenOrderEmail()
            {
                DelicatessenOrderId = id,
                Send = false,
                TypeEmail = 3
            });
            _context.SaveChanges();
        }
    }
}