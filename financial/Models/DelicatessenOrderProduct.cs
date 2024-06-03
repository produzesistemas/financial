using System.ComponentModel.DataAnnotations.Schema;
namespace Models
{
    [Table("DelicatessenOrderProduct")]
    public class DelicatessenOrderProduct : BaseEntity
    {
        public int DelicatessenOrderId { get; set; }
        public int DelicatessenProductId { get; set; }
        public decimal Value { get; set; }
            public decimal Quantity { get; set; }

        [NotMapped]
        public virtual DelicatessenOrder DelicatessenOrder { get; set; }
        [NotMapped]
        public virtual DelicatessenProduct DelicatessenProduct { get; set; }

    }
}
