import React, { useState } from 'react';
import { useForm } from '../../core/Form.js';
import { useValidation } from '../../core/Validation.js';
import { CheckCircle2, AlertCircle, RefreshCw, Send } from 'lucide-react';

export function FormPlaygrounds({ moduleId }: { moduleId: string }) {
  // Form State
  const [formValues, setFormValues] = useState({ username: 'alex_dev', email: 'alex@example.com', password: 'secure_password_123', age: '28' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({});
  const [submittedData, setSubmittedData] = useState<any>(null);

  // Validation playground state
  const [valEmail, setValEmail] = useState('invalid-email-format');
  const [valPassword, setValPassword] = useState('short');
  const [valAge, setValAge] = useState('15');
  const [validationResults, setValidationResults] = useState<any>(null);

  const handleTestValidation = () => {
    const validator = new useValidation({
      email: [{ type: 'required' }, { type: 'email', message: 'Must be a valid email format' }],
      password: [{ type: 'required' }, { type: 'minLength', params: 8, message: 'Must be at least 8 characters' }],
      age: [{ type: 'numeric' }, { type: 'range', params: [18, 99], message: 'Must be between 18 and 99' }]
    });

    const res = validator.validate({ email: valEmail, password: valPassword, age: valAge });
    setValidationResults(res);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!formValues.username) errors.username = 'Username is required';
    if (!formValues.email || !formValues.email.includes('@')) errors.email = 'Valid email is required';
    if (formValues.password.length < 6) errors.password = 'Password must be >= 6 chars';

    setFormErrors(errors);
    setFormTouched({ username: true, email: true, password: true, age: true });

    if (Object.keys(errors).length === 0) {
      setSubmittedData({ ...formValues, submittedAt: new Date().toISOString() });
    }
  };

  if (moduleId === 'validation') {
    return (
      <div className="space-y-5">
        <p className="text-xs text-neutral-400">
          Declarative schema validation with built-in rules (required, email, minLength, maxLength, range, numeric, regex).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Email Input</label>
            <input
              type="text"
              value={valEmail}
              onChange={(e) => setValEmail(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-lg text-sm font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Password (min 8)</label>
            <input
              type="text"
              value={valPassword}
              onChange={(e) => setValPassword(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-lg text-sm font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Age (18 - 99)</label>
            <input
              type="text"
              value={valAge}
              onChange={(e) => setValAge(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-lg text-sm font-mono"
            />
          </div>
        </div>

        <button
          onClick={handleTestValidation}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" /> Run useValidation()
        </button>

        {validationResults && (
          <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-4 font-mono text-xs space-y-2">
            <div className="flex justify-between border-b border-neutral-800 pb-2">
              <span>Validation Output</span>
              <span className={validationResults.isValid ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {validationResults.isValid ? '✓ ALL PASS' : '✗ VALIDATION FAILED'}
              </span>
            </div>
            <pre className={validationResults.isValid ? 'text-emerald-300' : 'text-rose-300'}>
              {JSON.stringify(validationResults, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  }

  // Default: useForm
  return (
    <div className="space-y-5">
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Username</label>
            <input
              type="text"
              value={formValues.username}
              onChange={(e) => setFormValues({ ...formValues, username: e.target.value })}
              className={`w-full px-3.5 py-2 bg-neutral-900 border text-sm rounded-lg font-mono ${
                formErrors.username ? 'border-rose-500 text-rose-200' : 'border-neutral-700 text-neutral-100'
              }`}
            />
            {formErrors.username && <p className="text-[11px] text-rose-400 mt-1">{formErrors.username}</p>}
          </div>

          <div>
            <label className="text-xs text-neutral-400 block mb-1">Email Address</label>
            <input
              type="email"
              value={formValues.email}
              onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
              className={`w-full px-3.5 py-2 bg-neutral-900 border text-sm rounded-lg font-mono ${
                formErrors.email ? 'border-rose-500 text-rose-200' : 'border-neutral-700 text-neutral-100'
              }`}
            />
            {formErrors.email && <p className="text-[11px] text-rose-400 mt-1">{formErrors.email}</p>}
          </div>

          <div>
            <label className="text-xs text-neutral-400 block mb-1">Password</label>
            <input
              type="password"
              value={formValues.password}
              onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
              className={`w-full px-3.5 py-2 bg-neutral-900 border text-sm rounded-lg font-mono ${
                formErrors.password ? 'border-rose-500 text-rose-200' : 'border-neutral-700 text-neutral-100'
              }`}
            />
            {formErrors.password && <p className="text-[11px] text-rose-400 mt-1">{formErrors.password}</p>}
          </div>

          <div>
            <label className="text-xs text-neutral-400 block mb-1">Age</label>
            <input
              type="number"
              value={formValues.age}
              onChange={(e) => setFormValues({ ...formValues, age: e.target.value })}
              className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-700 text-neutral-100 text-sm rounded-lg font-mono"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Submit Form
          </button>
          <button
            type="button"
            onClick={() => {
              setFormValues({ username: '', email: '', password: '', age: '' });
              setFormErrors({});
              setSubmittedData(null);
            }}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-medium rounded-lg border border-neutral-700"
          >
            Reset
          </button>
        </div>
      </form>

      {submittedData && (
        <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-4 font-mono text-xs">
          <div className="text-emerald-400 font-semibold mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Form Submission Payload
          </div>
          <pre className="text-emerald-300">{JSON.stringify(submittedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
