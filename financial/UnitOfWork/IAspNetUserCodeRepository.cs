using Models;
using System;

namespace UnitOfWork
{
    public interface IAspNetUserCodeRepository : IDisposable
    {
       void Insert(AspNetUserCode entity);
       AspNetUserCode Get(string code);
    }
}
