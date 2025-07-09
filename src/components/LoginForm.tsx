import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface LoginFormProps {
  onLogin: (cedula: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [cedula, setCedula] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cedula.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor ingrese su número de cédula',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    
    // --- Airtable API Call ---
    const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
    const TABLE_NAME = 'Nomina Sirius'; // El nombre de tu tabla en Airtable

    // Construye la URL para consultar Airtable, filtrando por el campo 'Cedula'
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(TABLE_NAME)}?filterByFormula=({Cedula}='${cedula}')`;

    // Verifica que las variables de entorno estén configuradas
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      console.error("La API Key o el Base ID de Airtable no están configurados en .env.local");
      toast({
        title: 'Error de Configuración',
        description: 'Faltan las credenciales de Airtable. Contacte al administrador.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(url, {
        headers: {
          // Usa la API Key para la autorización
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
      });

      if (!response.ok) {
        // Esto puede ocurrir por una API Key o Base ID inválidos
        // Agregamos un log para ver el detalle del error en la consola del navegador
        const errorData = await response.json();
        console.error('Airtable API Error:', errorData);
        throw new Error('Error al conectar con Airtable. Verifique la configuración.');
      }

      const data = await response.json();

      // Si el array 'records' tiene al menos un elemento, la cédula es válida
      if (data.records && data.records.length > 0) {
        // La cédula es válida, procede con el login
        onLogin(cedula);
        toast({
          title: 'Éxito',
          description: 'Inicio de sesión exitoso'
        });
      } else {
        // La cédula no fue encontrada en la base de datos
        toast({
          title: 'Error de validación',
          description: 'El número de cédula no se encuentra registrado.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: (error as Error).message || 'No se pudo validar la cédula. Intente de nuevo.',
        variant: 'destructive'
      });
    } finally {
      // Asegura que el estado de carga siempre se desactive
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Control Laboral</CardTitle>
          <CardDescription>Ingrese su número de cédula para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cedula">Número de Cédula</Label>
              <Input
                id="cedula"
                type="text" // Se mantiene como texto para evitar los controles de número en escritorio
                inputMode="numeric" // Pide al navegador que muestre un teclado numérico en móviles
                pattern="[0-9]*" // Ayuda a la validación y refuerza el tipo de entrada
                value={cedula}
                onChange={(e) => {
                  // Filtra la entrada para permitir solo dígitos
                  setCedula(e.target.value.replace(/[^0-9]/g, ''));
                }}
                placeholder="Ingrese su cédula"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validando...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;