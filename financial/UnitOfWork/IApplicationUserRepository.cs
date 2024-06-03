using Models;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace UnitOfWork
{
    public interface IApplicationUserRepository : IDisposable
    {
        ApplicationUser Get(string id);
        IQueryable<ApplicationUser> Where(Expression<Func<ApplicationUser, bool>> expression);
        void Insert(ApplicationUser entity);
        void Delete(string id);
        IQueryable<ApplicationUser> GetClients(int establishmentId);

    }
}
