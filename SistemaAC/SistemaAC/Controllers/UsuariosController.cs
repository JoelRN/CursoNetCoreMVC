using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using SistemaAC.Data;
using SistemaAC.Models;

namespace SistemaAC.Controllers
{
    public class UsuariosController : Controller
    {
        private readonly ApplicationDbContext _context;

        UserManager<ApplicationUser> _userManager;
        RoleManager<ApplicationRole> _roleManager;
        UsuarioRole _usuarioRole;
        public List<SelectListItem> usuarioRole;
        
        public UsuariosController(ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _usuarioRole = new UsuarioRole();
            usuarioRole = new List<SelectListItem>();
        }

        // GET: Usuarios
        public async Task<IActionResult> Index()
        {
            //Declaro una variable ID inicializado vacia
            var ID = "";
            //Declaro un objeto list que depende la clase Usuario
            List<Usuario> usuario = new List<Usuario>();
            //Ahora obtengo todos los registros de la tabla donde almaceno los usuarios
            //y lo almaceno en el objeto
            var appUsuario = await _context.ApplicationUser.ToListAsync();

            //ahora con una estructura foreach vamos a recorrer
            //todos los valores del objeto appUsuario
            foreach (var Data in appUsuario)
            {
                ID = Data.Id.ToString();
                //LLamamos al metodo getRol que nos permitira
                //obtener el rol segun un usuario especifico
                usuarioRole = await _usuarioRole.GetRole(_userManager, _roleManager, ID);

                //Agregamos a la lista del tipo usuario uno a uno los
                //registros del usuario, teniendo en cuenta
                //solo los atributos específicos de la clase Usuario
                //Recordemos que el objeto data hace referencia a la clase ApplicationUser y
                //el objeto usuario es una lista del tipo Usuario (Clase Usuario)
                usuario.Add(new Usuario()
                {
                    Id = Data.Id.ToString(),
                    UserName = Data.UserName,
                    PhoneNumber = Data.PhoneNumber,
                    Email = Data.Email,
                    Role = usuarioRole[0].Text
                });
            }

            return View(usuario.ToList());
        }

        public async Task<List<ApplicationUser>> GetUsuario(Guid id)
        {
            List<ApplicationUser> usuario = new List<ApplicationUser>();
            var appUsuario = await _context.ApplicationUser.SingleOrDefaultAsync(m => m.Id == id);
            usuario.Add(appUsuario);
            return usuario;
        }

        public async Task<string> EditUsuario(string id, string userName, string email,
            string phoneNumber, int accessFailedCount, string concurrencyStamp, bool emailConfirmed,
            bool lockoutEnabled, DateTimeOffset lockoutEnd, string normalizedEmail,
            string normalizedUserName, string passwordHash, bool phoneNumberConfirmed,
            string securityStamp, bool twoFactorEnabled, ApplicationUser applicationUser)
        {
            var resp = "";

            try
            {
                applicationUser = new ApplicationUser
                {
                    Id = new Guid(id),
                    UserName = userName,
                    Email = email,
                    PhoneNumber = phoneNumber,
                    AccessFailedCount = accessFailedCount,
                    ConcurrencyStamp = concurrencyStamp,
                    EmailConfirmed = emailConfirmed,
                    LockoutEnabled = lockoutEnabled,
                    LockoutEnd = lockoutEnd,
                    NormalizedEmail = normalizedEmail,
                    NormalizedUserName = normalizedUserName,
                    PasswordHash = passwordHash,
                    PhoneNumberConfirmed = phoneNumberConfirmed,
                    SecurityStamp = securityStamp,
                    TwoFactorEnabled = twoFactorEnabled
                };

                //Actualizar los datos
                _context.Update(applicationUser);
                await _context.SaveChangesAsync();
                resp = "Save";
            }
            catch
            {
                resp = "No Save";
            }
            return resp;
        }

        private bool ApplicationUserExists(Guid id)
        {
            return _context.ApplicationUser.Any(e => e.Id == id);
        }
    }
}
