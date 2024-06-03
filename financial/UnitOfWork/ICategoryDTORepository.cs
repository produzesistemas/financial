using Models;
using System;

namespace UnitOfWork
{
    public interface ICategoryDTORepository : IDisposable
    {
        CategoryDTO Get(CategoryDTO filter);
    }
}
