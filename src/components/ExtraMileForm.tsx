import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Send, Mic } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ExtraMileForm: React.FC = () => {
  const { userCedula } = useAuth();
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const categories = ['Soporte técnico', 'Documentación', 'Capacitación', 'Reuniones', 'Otros'];

  const handleRecord = () => {
    setIsRecording(!isRecording);
    toast({ title: isRecording ? 'Grabación detenida' : 'Grabación iniciada' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      toast({ title: 'Error', description: 'La descripción es requerida', variant: 'destructive' });
      return;
    }

    try {
      await fetch('https://telegram-apps-u38879.vm.elestio.app/webhook-test/cd26a91d-11e4-4627-b63e-df678914d387', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cedula: userCedula, description, category, timestamp: new Date().toISOString() })
      });
      
      toast({ title: 'Éxito', description: 'Milla extra registrada' });
      setDescription('');
      setCategory('');
    } catch {
      toast({ title: 'Error', description: 'No se pudo registrar', variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Registrar Milla Extra</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe el trabajo adicional..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Categoría (opcional)</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button type="button" onClick={handleRecord} variant="outline" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              {isRecording ? 'Detener' : 'Grabar'}
            </Button>
            {isRecording && <span className="text-sm text-red-600 flex items-center">🔴 Grabando...</span>}
          </div>
          
          <Button type="submit" className="w-full flex items-center gap-2">
            <Send className="h-4 w-4" />
            Enviar Milla Extra
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExtraMileForm;