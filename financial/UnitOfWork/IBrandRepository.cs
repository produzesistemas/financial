using Microsoft.AspNetCore.Http;
using Models;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace UnitOfWork
{
    public interface IBrandRepository : IDisposable
    {
        IQueryable<Brand> GetAll();
    }
}
