using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Identity;

namespace SistemaAC.Models
{
    public class ApplicationRole : IdentityRole<Guid>
    {
        public ApplicationRole(string Name)
        {
            this.Name = Name;
        }
    }
}
