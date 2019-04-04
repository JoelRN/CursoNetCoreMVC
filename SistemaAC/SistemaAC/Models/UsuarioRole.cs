using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SistemaAC.Models
{
    public class UsuarioRole
    {
        public List<SelectListItem> usuarioRoles;

        public UsuarioRole()
        {
            usuarioRoles = new List<SelectListItem>();
        }

        public async Task<List<SelectListItem>> GetRole(UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager, string ID)
        {
            usuarioRoles = new List<SelectListItem>();
            string rol;
            var usuario = await userManager.FindByIdAsync(ID);
            var roles = await userManager.GetRolesAsync(usuario);

            //Vamos a comprobar si tenemos roles con ese usuario
            if (roles.Count == 0)
            {
                usuarioRoles.Add(new SelectListItem()
                {
                    Value = "null",
                    Text = "No Role"
                });
            }
            else
            {
                rol = Convert.ToString(roles[0]);
                var rolesId = roleManager.Roles.Where(m => m.Name == rol);
                foreach (var Data in rolesId)
                {
                    usuarioRoles.Add(new SelectListItem()
                    {
                        Value = Data.Id.ToString(),
                        Text = Data.Name,
                    });
                }
            }
            //Ahora retornamos el objeto usuarioRoles
            return usuarioRoles;
        }

        public List<SelectListItem> Roles(RoleManager<ApplicationRole> roleManager)
        {
            var roles = roleManager.Roles.ToList();
            foreach (var Data in roles)
            {
                usuarioRoles.Add(new SelectListItem()
                {
                    Value = Data.Id.ToString(),
                    Text = Data.Name
                });
            }
            return usuarioRoles;
        }
    }
}
