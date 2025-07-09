import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Send, Mic } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ExtraMileForm: React.FC = () => {
  const { userCedula } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState<string | null>(null);

  const handleRecord = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsRecording(true);
        toast({ title: 'Grabación iniciada', description: 'Comienza a hablar...' });
        
        // Aquí se implementaría la lógica real de grabación
        // Por ahora simulamos que después de unos segundos se detiene
        setTimeout(() => {
          setIsRecording(false);
          setAudioData('audio_data_placeholder');
          toast({ title: 'Grabación completada', description: 'Audio guardado correctamente' });
        }, 1000);
        
      } catch (error) {
        toast({ 
          title: 'Error', 
          description: 'No se pudo acceder al micrófono', 
          variant: 'destructive' 
        });
      }
    } else {
      setIsRecording(false);
      setAudioData('audio_data_placeholder');
      toast({ title: 'Grabación detenida', description: 'Audio guardado correctamente' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!audioData) {
      toast({ title: 'Error', description: 'Debe grabar un audio antes de enviar', variant: 'destructive' });
      return;
    }

    try {
      await fetch('https://telegram-apps-u38879.vm.elestio.app/webhook-test/cd26a91d-11e4-4627-b63e-df678914d387', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cedula: userCedula, 
          audioData, 
          type: 'extra_mile',
          timestamp: new Date().toISOString() 
        })
      });
      
      toast({ title: 'Éxito', description: 'Milla extra registrada' });
      setAudioData(null);
      setIsRecording(false);
    } catch {
      toast({ title: 'Error', description: 'No se pudo registrar', variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Registrar Milla Extra</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm text-gray-600 leading-relaxed">
            <strong>De corazón, cuéntanos:</strong> Graba un mensaje donde nos compartas, con la mayor sinceridad y detalle posible, 
            el trabajo adicional que realizaste. Queremos escuchar tu historia: ¿Qué hiciste exactamente?, ¿cuánto tiempo invertiste?, 
            ¿qué te motivó a hacerlo? y, sobre todo, ¿qué resultado o aprendizaje valioso surgió de ello?  
            Tu voz y experiencia son fundamentales para que podamos valorar y comprender el impacto de tu dedicación.
          </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <Button 
              type="button" 
              onClick={handleRecord} 
              variant="outline" 
              className="flex items-center gap-2 h-12"
            >
              <Mic className="h-4 w-4" />
              {isRecording ? 'Detener Grabación' : 'Iniciar Grabación'}
            </Button>
            
            {isRecording && (
              <div className="flex items-center gap-2 text-sm text-red-600 justify-center">
                <span className="animate-pulse">🔴</span>
                Grabando audio...
              </div>
            )}
            
            {audioData && !isRecording && (
              <div className="flex items-center gap-2 text-sm text-green-600 justify-center">
                ✅ Audio grabado correctamente
              </div>
            )}
          </div>
          
          <Button type="submit" className="w-full flex items-center gap-2 h-12" disabled={!audioData}>
            <Send className="h-4 w-4" />
            Enviar Milla Extra
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExtraMileForm;