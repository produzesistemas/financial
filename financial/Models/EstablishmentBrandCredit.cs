using System.ComponentModel.DataAnnotations.Schema;
namespace Models
{
    [Table("EstablishmentBrandCredit")]

    public class EstablishmentBrandCredit : BaseEntity
    {

        public int EstablishmentId { get; set; }
        public int BrandId { get; set; }
        public bool Active { get; set; } = true;

        [NotMapped]
        public virtual Brand Brand { get; set; }

    }
}
