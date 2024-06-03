using Microsoft.AspNetCore.Http;
using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace UnitOfWork
{
    public interface IDelicatessenProductRepository : IDisposable
    {
        DelicatessenProduct Get(int id);
        void Active(int id);
        IQueryable<DelicatessenProduct> Where(Expression<Func<DelicatessenProduct, bool>> expression);
        IQueryable<DelicatessenProduct> WhereNotInclude(Expression<Func<DelicatessenProduct, bool>> expression);
        void Delete(int id, string fileDelete);
        void Update(DelicatessenProduct entity, string pathToSave, IFormFileCollection files);
        void Insert(DelicatessenProduct entity);
        void checkActive(List<DelicatessenOrderProduct> delicatessenOrderProducts);
    }
}
