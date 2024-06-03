using Microsoft.AspNetCore.Http;
using Models;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace UnitOfWork
{
    public interface ICategoryRepository : IDisposable
    {
        Category Get(int id);
        IQueryable<Category> Where(Expression<Func<Category, bool>> expression);
        void Active(int id);
        void Delete(int id, string fileDelete);
        void Update(Category entity, string pathToSave, IFormFileCollection files);
        void Insert(Category entity);
    }
}
