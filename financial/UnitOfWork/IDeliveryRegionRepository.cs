using Models;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace UnitOfWork
{
    public interface IDeliveryRegionRepository : IDisposable
    {
        DeliveryRegion Get(int id);
        IQueryable<DeliveryRegion> Where(Expression<Func<DeliveryRegion, bool>> expression);
        void Active(int id);
        void Delete(int id);
        void Update(DeliveryRegion entity);
        void Insert(DeliveryRegion entity);
    }
}
