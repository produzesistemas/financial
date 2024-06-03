using System.ComponentModel.DataAnnotations.Schema;
namespace Models
{
    [Table("EstablishmentBrandDebit")]

    public class EstablishmentBrandDebit : BaseEntity
    {

        public int EstablishmentId { get; set; }
        public int BrandId { get; set; }
        public bool Active { get; set; } = true;

        [NotMapped]
        public virtual Brand Brand { get; set; }

    }
}
