using Models;
using System.Linq;
using UnitOfWork;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System;
using System.CodeDom;

namespace Repositorys
{
    public class DeliveryRegionRepository : IDeliveryRegionRepository, IDisposable
    {
        private readonly ApplicationDbContext _context;
        private bool disposed = false;

        public DeliveryRegionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public DeliveryRegion Get(int id)
        {
            return _context.DeliveryRegion
                .Single(x => x.Id == id);
        }

        public IQueryable<DeliveryRegion> Where(Expression<Func<DeliveryRegion, bool>> expression)
        {
           return _context.DeliveryRegion.Where(expression)
                .AsQueryable();
        }

        public void Active(int id)
        {
            var entity = _context.DeliveryRegion.FirstOrDefault(x => x.Id == id);
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

        public void Delete(int id)
        {
            var entity = _context.DeliveryRegion.FirstOrDefault(x => x.Id == id);
            _context.Remove(entity);
            _context.SaveChanges();
        }

        public void Update(DeliveryRegion entity)
        {
            var entityBase = _context.DeliveryRegion.FirstOrDefault(x => x.Id == entity.Id);
            entityBase.PostalCode = entity.PostalCode;
            if (entity.Value.HasValue)
            {
                entityBase.Value = entity.Value.Value;
            }
            _context.Entry(entityBase).State = EntityState.Modified;
            _context.SaveChanges();
        }

        public void Insert(DeliveryRegion entity)
        {
            _context.DeliveryRegion.Add(entity);
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

    }
}
