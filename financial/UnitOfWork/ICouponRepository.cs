using Models;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace UnitOfWork
{
    public interface ICouponRepository : IDisposable
    {
        IQueryable<Coupon> GetAll();
        Coupon Get(int id);
        Coupon Check(int id, string applicationUserId);
        IQueryable<Coupon> Where(Expression<Func<Coupon, bool>> expression);
        void Delete(int id);
        void Update(Coupon entity);
        void Insert(Coupon entity);
        void Active(int id);
    }
}
