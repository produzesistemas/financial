using Models;
using System;
using System.Linq.Expressions;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace UnitOfWork
{
    public interface IDelicatessenOrderEmailRepository : IDisposable
    {
        IQueryable<DelicatessenOrderEmail> Where(Expression<Func<DelicatessenOrderEmail, bool>> expression);
        void Update(DelicatessenOrderEmail entity);
    }
}
