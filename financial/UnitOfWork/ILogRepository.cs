using Models;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace UnitOfWork
{
    public interface ILogRepository : IDisposable
    {
        Log Get(int id);
        IQueryable<Log> Where(Expression<Func<Log, bool>> expression);
        void Insert(Log entity);
    }
}
