using Microsoft.AspNetCore.Http;
using Models;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace UnitOfWork
{
    public interface IEstablishmentRepository : IDisposable
    {
        Establishment Get(int id);
        IQueryable<Establishment> Where(Expression<Func<Establishment, bool>> expression);
        void Active(int id);
        void Update(Establishment entity, string fileDelete, IFormFileCollection files);
        void Insert(Establishment entity);
        IQueryable<Establishment> GetAll();
        Establishment GetByOwner(string id);
        Establishment GetByOwnerUpdate(string id);
        void DeleteImage(Establishment entity, string pathToSave);


	}
}
