import { useActionState, useOptimistic } from 'react';
import React, { useState, useEffect } from 'react';

async function submitProfile(formData, addOptimisticFeedback) {
  addOptimisticFeedback('Beaming to galaxy hub...');

  const skills = formData.getAll('skills');
  const payload = {
    personal: {
      name: formData.get('name'),
      email: formData.get('email'),
      age: formData.get('age'),
    },
    preferences: {
      newsletter: formData.get('newsletter') === 'on',
    },
    skills: skills.map((skill, index) => ({
      name: skill,
      proficiency: formData.get(`proficiency-skill${index + 1}`),
    })),
  };

  await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await fetch('/api/profile', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  }).catch(() => {
    throw new Error('Galactic relay error');
  });

  const result = { message: 'Profile beamed to orbit!' };
  return { message: result.message };
}

const ProfileForm = () => {
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [optimisticFeedback, addOptimisticFeedback] = useOptimistic(feedbackMessage, (state, value) => value);

  const [state, submitAction, isPending] = useActionState(
    (formData) => submitProfile(formData, addOptimisticFeedback),
    { status: 'idle', data: null, error: null }
  );

  useEffect(() => {
    if (state.status === 'success') {
      setFeedbackMessage('Profile beamed to orbit!');
    }
  }, [state.status]);

  return (
    <form
      action={submitAction}
      className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-purple-500 via-blue-50 to-gray-300 shadow-xl rounded-3xl border border-purple-800/40 relative overflow-hidden"
    >
      {/* Galaxy Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute w-40 h-40 bg-purple-500 rounded-full filter blur-3xl top-10 left-10 animate-pulse-slow" />
        <div className="absolute w-24 h-24 bg-blue-600 rounded-full filter blur-2xl bottom-20 right-16 animate-pulse-slow delay-300" />
      </div>

      {/* Personal Details */}
      <div className="space-y-6 relative z-10">
        <h2 className="text-3xl font-extrabold text-purple-200 tracking-widest">Galactic Registry</h2>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-purple-300">
            Starfarer Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            disabled={isPending}
            required
            className="mt-2 block w-full p-4 bg-gray-900/70 border-2 border-purple-700/50  rounded-l-[24px] text-white placeholder-purple-400/60 focus:ring-4 focus:ring-purple-500/50  focus:border-pink-600 shadow-inner transition-all duration-500 disabled:bg-gray-800/50 disabled:text-purple-300/50"
            placeholder="e.g., Zara Vega"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-purple-300">
            Interstellar Comm
          </label>
          <input
            type="email"
            name="email"
            id="email"
            disabled={isPending}
            required
            className="mt-2 block w-full p-4 bg-gray-900/70 border-2 border-purple-700/50 rounded-full text-white placeholder-purple-400/60 focus:ring-4 focus:ring-purple-500/50 focus:border-purple-600 shadow-inner transition-all duration-500 disabled:bg-gray-800/50 disabled:text-purple-300/50"
            placeholder="zara@galaxy.net"
          />
        </div>
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-purple-300">
            Orbital Cycles
          </label>
          <input
            type="number"
            name="age"
            id="age"
            disabled={isPending}
            className="mt-2 block w-full p-4 bg-gray-900/70 border-2 border-purple-700/50 rounded-full text-white placeholder-purple-400/60 focus:ring-4 focus:ring-purple-500/50 focus:border-purple-600 shadow-inner transition-all duration-500 disabled:bg-gray-800/50 disabled:text-purple-300/50"
            placeholder="e.g., 42"
          />
        </div>
      </div>

      {/* Preferences */}
      <div className="mt-8 relative z-10">
        <label className="flex items-center space-x-4">
          <input
            type="checkbox"
            name="newsletter"
            disabled={isPending}
            className="h-6 w-6 text-purple-400 border-purple-700/50 rounded-full bg-gray-900/70 focus:ring-purple-500 shadow-inner disabled:opacity-50 transition-all duration-300"
          />
          <span className="text-sm font-medium text-purple-300">Subscribe to Nebula Alerts</span>
        </label>
      </div>

      {/* Skills */}
      <fieldset className="mt-8 space-y-6 relative z-10">
        <legend className="text-3xl font-extrabold text-purple-600 tracking-widest">Planetary Skills</legend>
        <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-8">
          <div>
            <label className="block text-sm font-medium text-purple-300">Skill Orbit 1</label>
            <input
              type="text"
              name="skills"
              disabled={isPending}
              className="mt-2 block w-full p-4 bg-gray-900/70 border-2 border-purple-700/50 rounded-full text-white placeholder-purple-400/60 focus:ring-4 focus:ring-purple-500/50 focus:border-purple-600 shadow-inner transition-all duration-500 disabled:bg-gray-800/50 disabled:text-purple-300/50"
              placeholder="e.g., Astro-coding"
            />
            <select
              name="proficiency-skill1"
              disabled={isPending}
              className="mt-2 block w-full p-4 bg-gray-900/70 border-2 border-purple-700/50 rounded-full text-white focus:ring-4 focus:ring-purple-500/50 focus:border-purple-600 shadow-inner transition-all duration-500 disabled:bg-gray-800/50 disabled:text-purple-300/50"
            >
              <option value="beginner" className="bg-gray-900">Meteor</option>
              <option value="intermediate" className="bg-gray-900">Planet</option>
              <option value="expert" className="bg-gray-900">Star</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-300">Skill Orbit 2</label>
            <input
              type="text"
              name="skills"
              disabled={isPending}
              className="mt-2 block w-full p-4 bg-gray-900/70 border-2 border-purple-700/50 rounded-full text-white placeholder-purple-400/60 focus:ring-4 focus:ring-purple-500/50 focus:border-purple-600 shadow-inner transition-all duration-500 disabled:bg-gray-800/50 disabled:text-purple-300/50"
              placeholder="e.g., Quantum Nav"
            />
            <select
              name="proficiency-skill2"
              disabled={isPending}
              className="mt-2 block w-full p-4 bg-gray-900/70 border-2 border-purple-700/50 rounded-full text-white focus:ring-4 focus:ring-purple-500/50 focus:border-purple-600 shadow-inner transition-all duration-500 disabled:bg-gray-800/50 disabled:text-purple-300/50"
            >
              <option value="beginner" className="bg-gray-900">Meteor</option>
              <option value="intermediate" className="bg-gray-900">Planet</option>
              <option value="expert" className="bg-gray-900">Star</option>
            </select>
          </div>
        </div>
      </fieldset>

      {/* Submit Button */}
      <div className="mt-10 relative z-10">
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 px-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-full shadow-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:from-gray-700 disabled:to-gray-800 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-500 transform hover:scale-105"
        >
          {isPending ? 'Beaming...' : 'Beam Profile'}
        </button>
      </div>

      {/* Feedback */}
      <div className="mt-6 text-center relative z-10">
        {optimisticFeedback && isPending && (
          <p className="text-purple-300 font-medium animate-pulse drop-shadow-md">{optimisticFeedback}</p>
        )}
        {state.error && (
          <div className="text-red-400 font-medium drop-shadow-md">{state.error.message}</div>
        )}
        {state.status === 'success' && (
          <p className="text-purple-300 font-medium drop-shadow-md">{feedbackMessage}</p>
        )}
      </div>
    </form>
  );
};

export default ProfileForm;