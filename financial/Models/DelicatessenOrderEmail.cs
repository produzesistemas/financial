using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    [Table("DelicatessenOrderEmail")]
    public class DelicatessenOrderEmail : BaseEntity
    {
        public bool Send { get; set; }
        public int TypeEmail { get; set; }
        public int DelicatessenOrderId { get; set; }

        [NotMapped]
        public virtual DelicatessenOrder DelicatessenOrder { get; set; }

    }
}
