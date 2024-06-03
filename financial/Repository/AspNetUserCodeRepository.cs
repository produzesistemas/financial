using Models;
using System;
using System.Linq;
using UnitOfWork;

namespace Repositorys
{
    public class AspNetUserCodeRepository : IAspNetUserCodeRepository, IDisposable
    {
        private readonly ApplicationDbContext _context;
        private bool disposed = false;

        public AspNetUserCodeRepository(ApplicationDbContext context)
        {
            _context = context;
        }

       

        public void Insert(AspNetUserCode entity)
        {
            _context.AspNetUserCode.Add(entity);
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

        public AspNetUserCode Get(string code)
        {
            return _context.AspNetUserCode.FirstOrDefault(x => x.Code == code);
        }
    }
}