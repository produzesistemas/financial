using Models;
using System;
using System.Linq;

namespace UnitOfWork
{
    public interface IStatusOrderRepository : IDisposable
    {
        IQueryable<StatusOrder> GetAll();


	}
}
