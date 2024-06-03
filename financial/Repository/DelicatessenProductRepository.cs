using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using UnitOfWork;

namespace Repositorys
{
    public class DelicatessenProductRepository : IDelicatessenProductRepository, IDisposable
    {
        private readonly ApplicationDbContext _context;
        private bool disposed = false;

        public DelicatessenProductRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public DelicatessenProduct Get(int id)
        {
            return _context.DelicatessenProduct
                .FirstOrDefault(x => x.Id == id);
        }

        public IQueryable<DelicatessenProduct> Where(Expression<Func<DelicatessenProduct, bool>> expression)
        {
            return _context.DelicatessenProduct
                                .Include(x => x.Category)
                .Where(expression);
        }

        public IQueryable<DelicatessenProduct> WhereNotInclude(Expression<Func<DelicatessenProduct, bool>> expression)
        {
            return _context.DelicatessenProduct
                .Where(expression);
        }

        public void Delete(int id, string fileDelete)
        {
            var entity = _context.DelicatessenProduct.FirstOrDefault(x => x.Id == id);
            fileDelete = string.Concat(fileDelete, entity.ImageName);
            if (System.IO.File.Exists(fileDelete))
            {
                System.IO.File.Delete(fileDelete);
            }
            _context.Remove(entity);
            _context.SaveChanges();
        }

        public void Update(DelicatessenProduct entity, string pathToSave, IFormFileCollection files)
        {
            var entityBase = _context.DelicatessenProduct.FirstOrDefault(x => x.Id == entity.Id);
            entityBase.Description = entity.Description;
            entityBase.Detail = entity.Detail;
            entityBase.CategoryId = entity.CategoryId;
            entityBase.Code = entity.Code;
            entityBase.Value = entity.Value;
            entityBase.Promotion = entity.Promotion;
            if (entity.Promotion)
            {
                if (entity.PromotionValue.HasValue)
                {
                    entityBase.PromotionValue = entity.PromotionValue.Value;
                }
            }

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

        public void Insert(DelicatessenProduct entity)
        {
            _context.DelicatessenProduct.Add(entity);
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

        public void Active(int id)
        {
            var entity = _context.DelicatessenProduct.FirstOrDefault(x => x.Id == id);
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

        public void checkActive(List<DelicatessenOrderProduct> delicatessenOrderProducts)
        {
            var ids = delicatessenOrderProducts.Select(x => x.DelicatessenProductId).ToList();
            var products = _context.DelicatessenProduct.Where(x => ids.Contains(x.Id)).ToList();
            products.ForEach(product =>
            {
                 if (product.Active == false)
                {
                    throw new Exception(string.Concat("O produto ", product.Description, " não está mais disponível no estoque!"));
                }
            });
        }
    }
}