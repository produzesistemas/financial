using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    [Table("StatusOrder")]
    public class StatusOrder : BaseEntity
    {
       public string Description { get; set; }

        [NotMapped]
        public List<DelicatessenOrderTracking> OrderTracks { get; set; }
    }
}
