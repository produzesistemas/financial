using Models;
using System;
using System.Linq;

namespace UnitOfWork
{
    public interface IModuleRepository : IDisposable
    {
        IQueryable<Module> GetAll();
    }
}
