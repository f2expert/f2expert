import React from 'react';
import { Eye, User, Mail, Phone, MapPin, Calendar, Clock, Award, GraduationCap, Users, CheckCircle2, XCircle } from 'lucide-react';

import { Button } from '../../atoms/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../atoms/Dialog';
import { Badge } from '../../atoms/Badge';

import { type Trainer } from '../../../services/trainerManagementApi';

interface ViewTrainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainer: Trainer;
}

const ViewTrainerModal: React.FC<ViewTrainerModalProps> = ({
  isOpen,
  onClose,
  trainer,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatExperience = (years: number) => {
    if (years === 0) return 'Fresher';
    if (years === 1) return '1 year';
    return `${years} years`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl font-semibold">
            <Eye className="mr-2 h-5 w-5" />
            Trainer Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section with Status */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-semibold">
                  {trainer.firstName.charAt(0)}{trainer.lastName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {trainer.firstName} {trainer.lastName}
                  </h2>
                  <p className="text-gray-600">Trainer ID: {trainer.trainerId}</p>
                  <p className="text-gray-600 text-sm">
                    Joined: {formatDate(trainer.joinedDate)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge 
                  variant={trainer.isActive ? "default" : "secondary"}
                  className={`${trainer.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} mb-2`}
                >
                  <div className="flex items-center">
                    {trainer.isActive ? (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {trainer.isActive ? "Active" : "Inactive"}
                  </div>
                </Badge>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatExperience(trainer.experience)}
                </div>
              </div>
            </div>

            {/* Bio */}
            {trainer.bio && (
              <div className="mt-4 p-4 bg-white rounded border">
                <h4 className="font-semibold text-gray-900 mb-2">Bio</h4>
                <p className="text-gray-700">{trainer.bio}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="mr-2 h-5 w-5" />
                Personal Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">First Name:</span>
                  <span className="font-medium">{trainer.firstName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Name:</span>
                  <span className="font-medium">{trainer.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gender:</span>
                  <span className="font-medium">{trainer.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date of Birth:</span>
                  <span className="font-medium">{formatDate(trainer.dateOfBirth)}</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-blue-600">{trainer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{trainer.phone}</span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Address
              </h3>
              <div className="space-y-3">
                {trainer.address.street && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Street:</span>
                    <span className="font-medium">{trainer.address.street}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">City:</span>
                  <span className="font-medium">{trainer.address.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">State:</span>
                  <span className="font-medium">{trainer.address.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Country:</span>
                  <span className="font-medium">{trainer.address.country}</span>
                </div>
                {trainer.address.zipCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">ZIP Code:</span>
                    <span className="font-medium">{trainer.address.zipCode}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Phone className="mr-2 h-5 w-5" />
                Emergency Contact
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{trainer.emergencyContact.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Relationship:</span>
                  <span className="font-medium">{trainer.emergencyContact.relationship}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{trainer.emergencyContact.phone}</span>
                </div>
                {trainer.emergencyContact.email && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-blue-600">{trainer.emergencyContact.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <GraduationCap className="mr-2 h-5 w-5" />
              Professional Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Specializations */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  Specializations
                </h4>
                <div className="flex flex-wrap gap-1">
                  {trainer.specializations.length > 0 ? (
                    trainer.specializations.map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                        {spec}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">None listed</span>
                  )}
                </div>
              </div>

              {/* Qualifications */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <GraduationCap className="mr-1 h-4 w-4" />
                  Qualifications
                </h4>
                <div className="flex flex-wrap gap-1">
                  {trainer.qualifications.length > 0 ? (
                    trainer.qualifications.map((qual, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700">
                        {qual}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">None listed</span>
                  )}
                </div>
              </div>

              {/* Expertise */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Award className="mr-1 h-4 w-4" />
                  Expertise
                </h4>
                <div className="flex flex-wrap gap-1">
                  {trainer.expertise.length > 0 ? (
                    trainer.expertise.map((exp, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700">
                        {exp}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">None listed</span>
                  )}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Award className="mr-1 h-4 w-4" />
                  Certifications
                </h4>
                <div className="flex flex-wrap gap-1">
                  {trainer.certifications.length > 0 ? (
                    trainer.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-orange-50 text-orange-700">
                        {cert}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">None listed</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-gray-50 border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Record Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Created At</p>
                <p className="font-medium">{formatDate(trainer.createdAt)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="font-medium">{formatDate(trainer.updatedAt)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Experience</p>
                <p className="font-medium">{formatExperience(trainer.experience)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-6 border-t">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ViewTrainerModal };