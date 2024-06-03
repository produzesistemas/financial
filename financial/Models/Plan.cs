using System.ComponentModel.DataAnnotations.Schema;
namespace Models
{
    [Table("Plan")]
    public class Plan : BaseEntity
    {
        public decimal Value { get; set; }
        public bool Active { get; set; }
        public int QtdMonth { get; set; }
        public string Description { get; set; }
        public int ModuleId { get; set; }

        [NotMapped]
        public virtual Module Module { get; set; }

    }
}
