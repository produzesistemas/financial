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
    public class BrandRepository : IBrandRepository, IDisposable
    {
        private readonly ApplicationDbContext _context;
        private bool disposed = false;

        public BrandRepository(ApplicationDbContext context)
        {
            _context = context;
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

        public IQueryable<Brand> GetAll()
        {
            return _context.Brand;

        }
    }
}
