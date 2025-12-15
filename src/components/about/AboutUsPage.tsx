import React from 'react';
import { ChefHat, Users, Star, Heart } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export const AboutUsPage: React.FC = () => {
  const handleNavigate = (path: string) => {
    window.location.hash = path;
  };

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Hero */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-red-600 font-semibold tracking-wide mb-3">
              About The Griller
            </p>
            <h1 className="mb-4">
              Crafted Flavors, Warm Hospitality, Unforgettable Moments
            </h1>
            <p className="text-lg text-stone-600 mb-6">
              At The Griller, we bring together fresh ingredients, skilled chefs,
              and a passion for great food to create an experience that feels
              like home—whether you&apos;re dining in or ordering online.
            </p>
            <p className="text-stone-600 mb-8">
              From handcrafted grills to comforting classics, our menu is designed
              to satisfy every craving. We believe in good food, good people,
              and good times.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => handleNavigate('/menu')}>
                Explore Our Menu
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleNavigate('/reservation')}
              >
                Book a Table
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1544025162-d76694265947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600"
                alt="Restaurant interior"
                className="w-full h-full object-cover"
              />
            </div>
            <Card className="absolute -bottom-6 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md shadow-lg">
              <div className="p-4 flex items-center gap-3">
                <ChefHat className="w-8 h-8 text-red-600" />
                <div>
                  <p className="font-semibold">15+ Signature Dishes</p>
                  <p className="text-sm text-stone-500">
                    Carefully curated by our head chef
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats / Highlights */}
      <section className="py-12 bg-white border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="font-semibold">Friendly Team</p>
                <p className="text-sm text-stone-600">
                  Dedicated staff focused on warm, attentive service.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Star className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="font-semibold">Guest-Favorite Recipes</p>
                <p className="text-sm text-stone-600">
                  Dishes refined over time based on real guest feedback.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                <Heart className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <p className="font-semibold">Made with Care</p>
                <p className="text-sm text-stone-600">
                  Quality ingredients and attention to detail in every plate.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Story + Values */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="mb-4">Our Story</h2>
            <p className="text-stone-600 mb-4">
              The Griller was born from a simple idea: bring people together
              around great food. From the first day we opened our doors, we&apos;ve
              focused on creating a space where families, friends, and food
              lovers can relax, connect, and enjoy freshly prepared dishes.
            </p>
            <p className="text-stone-600 mb-4">
              Whether you&apos;re here for a casual dinner, a celebration, or a
              quick bite, our team is committed to making your visit special.
            </p>
            <p className="text-stone-600">
              Over time, we&apos;ve expanded with online ordering and smarter
              restaurant management, but our heart remains the same: good food,
              made with care, served with a smile.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="mb-2">Our Values</h2>
            <Card>
              <div className="p-4">
                <p className="font-semibold mb-1">Quality First</p>
                <p className="text-sm text-stone-600">
                  We choose ingredients carefully and prepare each dish fresh in
                  our kitchen.
                </p>
              </div>
            </Card>
            <Card>
              <div className="p-4">
                <p className="font-semibold mb-1">Guest Experience</p>
                <p className="text-sm text-stone-600">
                  From the moment you visit our website to the last bite, we
                  want everything to feel smooth and welcoming.
                </p>
              </div>
            </Card>
            <Card>
              <div className="p-4">
                <p className="font-semibold mb-1">Teamwork</p>
                <p className="text-sm text-stone-600">
                  Our chefs, staff, and managers work together as one team to
                  deliver a consistent, high-quality experience.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-4">
            Come Experience The Griller
          </h2>
          <p className="text-lg mb-8 text-white/90">
            Reserve a table for your next meal or explore our menu and order online.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="ghost"
              onClick={() => handleNavigate('/menu')}
              className="!text-white !border-white hover:!bg-white hover:!text-red-600"
            >
              View Menu
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleNavigate('/reservation')}
              className="!text-white !border-white hover:!bg-white hover:!text-red-600"
            >
              Book a Table
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
