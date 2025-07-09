import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User, IdCard, Briefcase, Building } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const UserInfoCard: React.FC = () => {
  const { userInfo } = useAuth();

  if (!userInfo) return null;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Nombre</p>
                <p className="font-semibold text-gray-900">{userInfo.nombre}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <IdCard className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Cédula</p>
                <p className="font-semibold text-gray-900">{userInfo.cedula}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Cargo</p>
                <p className="font-semibold text-gray-900">{userInfo.cargo}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Área</p>
                <p className="font-semibold text-gray-900">{userInfo.area}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
