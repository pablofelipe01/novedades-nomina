import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Send, Mic } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWork } from '@/contexts/WorkContext';

const ExtraMileForm: React.FC = () => {
  const { userCedula } = useAuth();
  const { addExtraMile } = useWork();
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const handleRecord = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const recorder = new MediaRecorder(stream, {
          mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
        });
        
        const chunks: Blob[] = [];
        
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };
        
        recorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: recorder.mimeType });
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Audio = reader.result as string;
            setAudioData(base64Audio);
            toast({ title: 'Grabación completada', description: 'Audio guardado correctamente' });
          };
          reader.readAsDataURL(audioBlob);
          
          // Detener todas las pistas del stream
          stream.getTracks().forEach(track => track.stop());
        };
        
        recorder.start();
        setMediaRecorder(recorder);
        setAudioChunks(chunks);
        setIsRecording(true);
        
        toast({ title: 'Grabación iniciada', description: 'Habla ahora. Presiona "Detener" cuando termines.' });
        
      } catch (error) {
        console.error('Error al acceder al micrófono:', error);
        toast({ 
          title: 'Error', 
          description: 'No se pudo acceder al micrófono. Verifica los permisos.', 
          variant: 'destructive' 
        });
      }
    } else {
      // Detener grabación
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
      setIsRecording(false);
      setMediaRecorder(null);
      toast({ title: 'Grabación detenida', description: 'Procesando audio...' });
    }
  };

  // Cleanup effect para liberar recursos
  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
    };
  }, [mediaRecorder]);

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
      
      // Agregar milla extra al contexto de trabajo
      addExtraMile();
      
      toast({ title: 'Éxito', description: 'Milla extra registrada' });
      
      // Limpiar estado
      setAudioData(null);
      setIsRecording(false);
      setMediaRecorder(null);
      setAudioChunks([]);
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
              variant={isRecording ? "destructive" : "outline"}
              className="flex items-center gap-2 h-12"
              disabled={isRecording && mediaRecorder?.state === 'inactive'}
            >
              <Mic className="h-4 w-4" />
              {isRecording ? 'Detener Grabación' : 'Iniciar Grabación'}
            </Button>
            
            {isRecording && (
              <div className="flex flex-col items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <span className="animate-pulse text-lg">🔴</span>
                  <span className="font-medium">Grabando audio...</span>
                </div>
                <p className="text-xs text-red-500 text-center">
                  Habla ahora. Presiona "Detener Grabación" cuando termines.
                </p>
              </div>
            )}
            
            {audioData && !isRecording && (
              <div className="flex flex-col items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-green-600">
                  ✅ <span className="font-medium">Audio grabado correctamente</span>
                </div>
                <p className="text-xs text-green-500 text-center">
                  Ahora puedes enviar tu milla extra
                </p>
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