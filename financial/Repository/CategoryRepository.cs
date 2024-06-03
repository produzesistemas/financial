using Models;
using System.Linq;
using UnitOfWork;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System;
using System.CodeDom;
using Microsoft.AspNetCore.Http;

namespace Repositorys
{
    public class CategoryRepository : ICategoryRepository, IDisposable
    {
        private readonly ApplicationDbContext _context;
        private bool disposed = false;

        public CategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public Category Get(int id)
        {
            return _context.Category
                .Single(x => x.Id == id);
        }

        public IQueryable<Category> Where(Expression<Func<Category, bool>> expression)
        {
           return _context.Category.Where(expression)
                .AsQueryable();
        }

        public void Active(int id)
        {
            var entity = _context.Category.FirstOrDefault(x => x.Id == id);
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

        public void Delete(int id, string fileDelete)
        {
            var entity = _context.Category.FirstOrDefault(x => x.Id == id);
			fileDelete = string.Concat(fileDelete, entity.ImageName);
			if (System.IO.File.Exists(fileDelete))
			{
				System.IO.File.Delete(fileDelete);
			}
			_context.Remove(entity);
            _context.SaveChanges();
        }

        public void Update(Category entity, string pathToSave, IFormFileCollection files)
        {
            var entityBase = _context.Category.Single(x => x.Id == entity.Id);
            entityBase.Description = entity.Description;
			if (files.Count() > decimal.Zero)
			{
				pathToSave = string.Concat(pathToSave, entityBase.ImageName);
				entityBase.ImageName = entity.ImageName;
				if (System.IO.File.Exists(pathToSave))
				{
					System.IO.File.Delete(pathToSave);
				}
			}
			_context.Entry(entityBase).State = EntityState.Modified;
            _context.SaveChanges();
        }

        public void Insert(Category entity)
        {
            _context.Category.Add(entity);
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
