using Models;
using System;
using System.Linq.Expressions;
using System.Linq;
using System.Collections.Generic;

namespace UnitOfWork
{
    public interface IDelicatessenOrderRepository : IDisposable
    {
        IQueryable<DelicatessenOrder> Where(Expression<Func<DelicatessenOrder, bool>> expression);
        IQueryable<DelicatessenOrder> GetByUser(Expression<Func<DelicatessenOrder, bool>> expression);
        DelicatessenOrder Get(int id);
        void Insert(DelicatessenOrder entity);
        DelicatessenOrder GetToPartner(int id);
        void CancelByClient(int id);
    }
}
