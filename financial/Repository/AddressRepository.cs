using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using System;
using System.Linq;
using System.Linq.Expressions;
using UnitOfWork;

namespace Repositorys
{
    public class AddressRepository : IAddressRepository, IDisposable
    {
        private readonly ApplicationDbContext _context;
        private bool disposed = false;

        public AddressRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public Address GetLast(string applicationUserId, DeliveryRegion deliveryRegion)
        {
            return _context.Address.FirstOrDefault(x => x.ApplicationUserId == applicationUserId &&
            x.PostalCode == deliveryRegion.PostalCode);
        }

        public IQueryable<Address> Where(Expression<Func<Address, bool>> expression)
        {
           return  _context.Address.Where(expression).AsQueryable();
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

        public void Delete(int id)
        {
            var entity = _context.Address.Single(x => x.Id == id);
            _context.Remove(entity);
            _context.SaveChanges();
        }

        public void Update(Address entity)
        {
            var entityBase = _context.Address.Single(x => x.Id == entity.Id);
            entityBase.Street = entity.Street;
            entityBase.Uf = entity.Uf;
            entityBase.Reference = entity.Reference;
            entityBase.City = entity.City;
            entityBase.District = entity.District;
            entityBase.PostalCode = entity.PostalCode;
            _context.Entry(entityBase).State = EntityState.Modified;
            _context.SaveChanges();
        }

        public void Insert(Address entity)
        {
            _context.Address.Add(entity);
            _context.SaveChanges();
        }

    }
}
