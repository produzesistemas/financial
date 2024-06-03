using System.ComponentModel.DataAnnotations.Schema;
namespace Models
{
    [Table("Brand")]

    public class Brand : BaseEntity
    {
		public string Name { get; set; }
        public string ImageName { get; set; }
    }
}
