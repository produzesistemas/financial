using Models;
using System;
using System.Linq;
using System.Linq.Expressions;
namespace UnitOfWork
{
    public interface IAddressRepository : IDisposable
    {
        Address GetLast(string applicationUserId, DeliveryRegion deliveryRegion);
        IQueryable<Address> Where(Expression<Func<Address, bool>> expression);
        void Delete(int id);
        void Update(Address entity);
        void Insert(Address entity);
    }
}
