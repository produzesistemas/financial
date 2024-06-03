using Models;
using System.Linq;
using UnitOfWork;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System;
using System.CodeDom;
using Microsoft.AspNetCore.Http;
using System.IO;

namespace Repositorys
{
    public class EstablishmentRepository : IEstablishmentRepository, IDisposable
    {
        private readonly ApplicationDbContext _context;
        private bool disposed = false;

        public EstablishmentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public Establishment Get(int id)
        {
            return _context.Establishment.Include(x => x.ApplicationUser)
                .Select(x => new Establishment
                {
                    Id = x.Id,
                    ApplicationUserId = x.ApplicationUserId,
                    Email = x.ApplicationUser.Email,
                    Cnpj = x.Cnpj,
                     Address = x.Address,
                      ContactName = x.ContactName,
                       Description = x.Description,
                        ModuleId = x.ModuleId,
                         Name = x.Name,
                         MinimumValue = x.MinimumValue,
                          Phone = x.Phone,
                           PostalCode = x.PostalCode,
                            ImageName = x.ImageName,
                            Active = x.Active,
                            PaymentLittleMachine = x.PaymentLittleMachine,
                            PaymentMoney = x.PaymentMoney,
                             PaymentOnLine = x.PaymentOnLine,
                             InstorePickup = x.InstorePickup,
                              Delivery  = x.Delivery,
                              AccessTokenMercadoPago = x.AccessTokenMercadoPago
                })
                .FirstOrDefault(x => x.Id == id)
                ;
        }

        public IQueryable<Establishment> Where(Expression<Func<Establishment, bool>> expression)
        {
           return _context.Establishment.Where(expression)
                .AsQueryable();
        }

        public void Active(int id)
        {
            var entity = _context.Establishment.FirstOrDefault(x => x.Id == id);
            if (entity.Active)
            {
                entity.Active = false;
            }
            else
            {
                entity.Active = true;
            }
            _context.Entry(entity).State = EntityState.Modified;
            _context.SaveChanges();
        }

        public void Update(Establishment entity, string fileDelete, IFormFileCollection files)
        {
            var entityBase = _context.Establishment.FirstOrDefault(x => x.Id == entity.Id);
            entityBase.Name = entity.Name;
            entityBase.ContactName = entity.ContactName;
            entityBase.Description = entity.Description;
            entityBase.Address = entity.Address;
            entityBase.Cnpj = entity.Cnpj;
            entityBase.Phone = entity.Phone;
            entityBase.PostalCode = entity.PostalCode;
            entityBase.AccessTokenMercadoPago = entity.AccessTokenMercadoPago;

            if (entity.MinimumValue.HasValue)
            {
                entityBase.MinimumValue = entity.MinimumValue.Value;
            } else
            {
                entityBase.MinimumValue = null;
            }

            if (entity.Delivery.HasValue)
            {
                entityBase.Delivery = entity.Delivery.Value;
            }

            if (entity.PaymentOnLine.HasValue)
            {
                entityBase.PaymentOnLine = entity.PaymentOnLine.Value;
            }

            if (entity.InstorePickup.HasValue)
            {
                entityBase.InstorePickup = entity.InstorePickup.Value;
            }

            if (entity.PaymentMoney.HasValue)
            {
                entityBase.PaymentMoney = entity.PaymentMoney.Value;
            }

            if (entity.PaymentLittleMachine.HasValue)
            {
                entityBase.PaymentLittleMachine = entity.PaymentLittleMachine.Value;
            }



            if (files.Count() > decimal.Zero)
            {
                fileDelete = string.Concat(fileDelete, entityBase.ImageName);
                entityBase.ImageName = entity.ImageName;
                if (System.IO.File.Exists(fileDelete))
                {
                    System.IO.File.Delete(fileDelete);
                }
            }

            _context.Entry(entityBase).State = EntityState.Modified;
            _context.SaveChanges();
        }

        public void Insert(Establishment entity)
        {
            _context.Establishment.Add(entity);
            _context.SaveChanges();
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

        public Establishment GetByOwner(string id)
        {
            var entity = _context.Establishment
                .Include(x => x.Module)
                .FirstOrDefault(x => x.ApplicationUserId == id);
            entity.Subscriptions = _context.Subscription.Include(x => x.Plan)
                .Where(x => x.EstablishmentId == entity.Id)
                .OrderByDescending(x => x.SubscriptionDate);
            return entity;

        }


        public Establishment GetByOwnerUpdate(string id)
        {
            var entity = _context.Establishment
                .FirstOrDefault(x => x.ApplicationUserId == id);
            return entity;

        }

        public IQueryable<Establishment> GetAll()
        {
            return _context.Establishment;
        }

		public void DeleteImage(Establishment entity, string pathToSave)
		{
			if (File.Exists(string.Concat(pathToSave, entity.ImageName)))
			{
				File.Delete(string.Concat(pathToSave, entity.ImageName));
			}
			var entityBase = _context.Establishment.FirstOrDefault(x => x.Id == entity.Id);
            entityBase.ImageName = string.Empty;
			_context.Entry(entityBase).State = EntityState.Modified;
			_context.SaveChanges();
		}
	}
}
