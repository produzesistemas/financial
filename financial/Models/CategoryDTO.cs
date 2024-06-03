using System.Collections.Generic;

namespace Models
{
    public class CategoryDTO : BaseEntity
    {
        public int EstablishmentId { get; set; }
        public string ImageName { get; set; }
        public virtual IEnumerable<Category> Categorys { get; set; }
        public virtual IEnumerable<OpeningHours> OpeningHours { get; set; }
        public CategoryDTO()
        {
        }
    }
}
