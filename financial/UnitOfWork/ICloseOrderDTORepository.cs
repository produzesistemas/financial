using Models;
using System;

namespace UnitOfWork
{
    public interface ICloseOrderDTORepository : IDisposable
    {
        CloseOrderDTO Get(CloseOrderDTO closeOrderDTO);
    }
}
