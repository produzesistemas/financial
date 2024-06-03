using Microsoft.EntityFrameworkCore;
using Models;
using System;
using System.Linq;
using System.Linq.Expressions;
using UnitOfWork;

namespace Repositorys
{
    public class LogRepository : ILogRepository, IDisposable
    {
        private readonly ApplicationDbContext _context;
        private bool disposed = false;

        public LogRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public Log Get(int id)
        {
            return _context.Log
                .FirstOrDefault(x => x.Id == id);
        }

        public IQueryable<Log> Where(Expression<Func<Log, bool>> expression)
        {
            return _context.Log
                .Include(x => x.ApplicationUser)
                .Where(expression).AsQueryable()
                .Select(x => new Log
                {
                    Id = x.Id,
                    Name = x.ApplicationUser.Name,
                    Description = x.Description,
                    CreateDate = x.CreateDate,
                    Type = x.Type
                });
        }

        public void Insert(Log entity)
        {
            _context.Log.Add(entity);
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