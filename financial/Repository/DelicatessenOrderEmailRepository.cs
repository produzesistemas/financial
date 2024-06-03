using Models;
using System;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using UnitOfWork;

namespace Repositorys
{
    public class DelicatessenOrderEmailRepository : IDelicatessenOrderEmailRepository, IDisposable
    {
        private readonly ApplicationDbContext _context;
        private bool disposed = false;

        public DelicatessenOrderEmailRepository(ApplicationDbContext context)
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

        public IQueryable<DelicatessenOrderEmail> Where(Expression<Func<DelicatessenOrderEmail, bool>> expression)
        {
            return _context.DelicatessenOrderEmail
                .Include(x => x.DelicatessenOrder).
                 ThenInclude(x => x.DelicatessenOrderProducts).ThenInclude(x => x.DelicatessenProduct)
                .Include(x => x.DelicatessenOrder).
                 ThenInclude(x => x.DelicatessenOrderTrackings)
                .Include(x => x.DelicatessenOrder).
                 ThenInclude(x => x.Establishment).ThenInclude(x => x.ApplicationUser)
                .Include(x => x.DelicatessenOrder).
                 ThenInclude(x => x.PaymentCondition)
                                 .Include(x => x.DelicatessenOrder).
                 ThenInclude(x => x.Coupon)
                                  .Include(x => x.DelicatessenOrder).
                 ThenInclude(x => x.Address)
                                                   .Include(x => x.DelicatessenOrder).
                 ThenInclude(x => x.EstablishmentBrandCredit).ThenInclude(x => x.Brand)
                                                                    .Include(x => x.DelicatessenOrder).
                 ThenInclude(x => x.EstablishmentBrandDebit).ThenInclude(x => x.Brand)
                .Where(expression);
        }

        public void Update(DelicatessenOrderEmail entity)
        {
            var entityBase = _context.DelicatessenOrderEmail.FirstOrDefault(x => x.Id == entity.Id);
            entityBase.Send = true;
            _context.Entry(entityBase).State = EntityState.Modified;
            _context.SaveChanges();
        }
    }
}