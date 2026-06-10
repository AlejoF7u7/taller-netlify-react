import { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({ nombre: '', email: '', mensaje: '' });
  const [mensajes, setMensajes] = useState([]);
  const [estado, setEstado] = useState({ visible: false, texto: '', tipo: '' });
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE = "/api";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const mostrarEstado = (texto, tipo) => {
    setEstado({ visible: true, texto, tipo });
    setTimeout(() => setEstado({ visible: false, texto: '', tipo: '' }), 5000);
  };

  const cargarMensajes = async () => {
    try {
      const res = await fetch(`${API_BASE}/mensajes`);
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setMensajes(result.data);
    } catch (error) {
      mostrarEstado(error.message, 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    mostrarEstado("Enviando datos...", "ok");

    try {
      const res = await fetch(`${API_BASE}/mensajes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      
      if (!res.ok) throw new Error(result.error);
      
      mostrarEstado(result.message, "ok");
      setMensajes([result.data, ...mensajes]);
      setFormData({ nombre: '', email: '', mensaje: '' });
    } catch (error) {
      mostrarEstado(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 font-sans">
      <header className="max-w-4xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-bold mb-2">Netlify Fullstack</h1>
        <p className="text-gray-400">React + Tailwind + Netlify Functions</p>
      </header>

      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Formulario */}
        <section className="bg-darkCard p-6 rounded-xl shadow-lg border border-gray-800">
          <h2 className="text-2xl font-semibold mb-6">Enviar mensaje</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
              <input 
                name="nombre" 
                value={formData.nombre} 
                onChange={handleChange} 
                required 
                className="w-full bg-[#141414] border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:border-brandRed transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                className="w-full bg-[#141414] border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:border-brandRed transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Mensaje</label>
              <textarea 
                name="mensaje" 
                rows="4" 
                value={formData.mensaje} 
                onChange={handleChange} 
                required 
                className="w-full bg-[#141414] border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:border-brandRed transition-colors resize-none"
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="mt-2 bg-brandRed hover:bg-brandRedHover disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-md transition-colors"
            >
              {isLoading ? 'Enviando...' : 'Enviar al backend'}
            </button>
          </form>

          {estado.visible && (
            <div className={`mt-4 p-4 rounded-md font-medium ${estado.tipo === 'ok' ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'}`}>
              {estado.texto}
            </div>
          )}
        </section>

        {/* Lista de Mensajes */}
        <section className="bg-darkCard p-6 rounded-xl shadow-lg border border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Mensajes</h2>
            <button 
              onClick={cargarMensajes}
              className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-md transition-colors"
            >
              Cargar demo
            </button>
          </div>
          
          <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2">
            {mensajes.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">No hay mensajes aún.</p>
            ) : (
              mensajes.map((msg) => (
                <div key={msg.id} className="bg-[#141414] p-4 rounded-lg border border-gray-800">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-brandRed mr-2">{msg.nombre}</span>
                      <span className="text-xs text-gray-500">({msg.email})</span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{msg.mensaje}</p>
                  <div className="text-xs text-gray-600">
                    {new Date(msg.fecha).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;