using Models;
using System.Linq;
using UnitOfWork;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System;
using System.Configuration;
using System.Collections.Generic;

namespace Repositorys
{
    public class ApplicationUserRepository : IApplicationUserRepository, IDisposable
    {
        private readonly ApplicationDbContext _context;
        private bool disposed = false;

        public ApplicationUserRepository(ApplicationDbContext context)
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

        public ApplicationUser Get(string id)
        {
            return _context.Users.FirstOrDefault(u => u.Id == id);
        }

        public IQueryable<ApplicationUser> Where(Expression<Func<ApplicationUser, bool>> expression)
        {
            return _context.Users.Where(expression);
        }

        public void Insert(ApplicationUser entity)
        {
            _context.Users.Add(entity);
            _context.SaveChanges();
        }

        public void Delete(string id)
        {
            var aspNetUserCode = _context.AspNetUserCode.Where(x => x.UserId  == id);
            _context.RemoveRange(aspNetUserCode);
            var entity = _context.Users.FirstOrDefault(x => x.Id == id);
            _context.Remove(entity);
            _context.SaveChanges();
        }

        public IQueryable<ApplicationUser> GetClients(int establishmentId)
        {
            var users = new List<ApplicationUser>();
            var clients = _context.DelicatessenOrder.Where(x => x.EstablishmentId == establishmentId).Select(c => c.ApplicationUserId);
            clients.ToList().ForEach(c =>
            {
               var user = _context.Users.FirstOrDefault(q => q.Id == c);
                if (user != null) users.Add(user);
            });
            return users.AsQueryable();
        }
    }
}
