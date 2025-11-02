import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { AlertCircle, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export default function App() {
  const [func, setFunc] = useState('x^2');
  const [xMin, setXMin] = useState(-5);
  const [xMax, setXMax] = useState(5);
  const [yMin, setYMin] = useState(null);
  const [yMax, setYMax] = useState(null);
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [autoYScale, setAutoYScale] = useState(true);

  const evaluateFunction = (x, expression) => {
    try {
      let expr = expression
        .replace(/\^/g, '**')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/log/g, 'Math.log10')
        .replace(/ln/g, 'Math.log')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/abs/g, 'Math.abs')
        .replace(/exp/g, 'Math.exp')
        .replace(/pi/g, 'Math.PI')
        .replace(/e(?![a-z])/g, 'Math.E');
      
      // eslint-disable-next-line no-new-func
      const f = new Function('x', `return ${expr}`);
      return f(x);
    } catch (e) {
      throw new Error('Invalid function');
    }
  };

  const plotFunction = useCallback(() => {
    try {
      setError('');
      const points = [];
      const step = (xMax - xMin) / 500;
      
      for (let x = xMin; x <= xMax; x += step) {
        const y = evaluateFunction(x, func);
        if (isFinite(y)) {
          points.push({ x: parseFloat(x.toFixed(4)), y: parseFloat(y.toFixed(4)) });
        }
      }
      
      if (points.length === 0) {
        setError('No valid points to plot');
        return;
      }
      
      setData(points);
    } catch (e) {
      setError(e.message);
      setData([]);
    }
  }, [func, xMin, xMax]);

  useEffect(() => {
    plotFunction();
  }, [plotFunction]);

  const zoomIn = () => {
    const range = xMax - xMin;
    const center = (xMax + xMin) / 2;
    const newRange = range * 0.7;
    setXMin(center - newRange / 2);
    setXMax(center + newRange / 2);
  };

  const zoomOut = () => {
    const range = xMax - xMin;
    const center = (xMax + xMin) / 2;
    const newRange = range * 1.5;
    setXMin(center - newRange / 2);
    setXMax(center + newRange / 2);
  };

  const resetZoom = () => {
    setXMin(-5);
    setXMax(5);
    setAutoYScale(true);
  };

  const yDomain = autoYScale ? ['auto', 'auto'] : [yMin || 'auto', yMax || 'auto'];

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)', padding: '1rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem', textAlign: 'center' }}>
          2D Function Plotter
        </h1>
        
        <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Function f(x)
              </label>
              <input
                type="text"
                value={func}
                onChange={(e) => setFunc(e.target.value)}
                style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '1rem' }}
                placeholder="e.g., x^2, sin(x), x^3 - 2*x"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                X Min
              </label>
              <input
                type="number"
                value={xMin}
                onChange={(e) => setXMin(parseFloat(e.target.value) || -5)}
                style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '1rem' }}
                step="0.1"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                X Max
              </label>
              <input
                type="number"
                value={xMax}
                onChange={(e) => setXMax(parseFloat(e.target.value) || 5)}
                style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '1rem' }}
                step="0.1"
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                onClick={plotFunction}
                style={{ width: '100%', background: '#2563eb', color: 'white', fontWeight: '600', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
              >
                Plot Graph
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            <button
              onClick={zoomIn}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#16a34a', color: 'white', fontWeight: '600', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
            >
              <ZoomIn size={18} />
              Zoom In
            </button>
            <button
              onClick={zoomOut}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ea580c', color: 'white', fontWeight: '600', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
            >
              <ZoomOut size={18} />
              Zoom Out
            </button>
            <button
              onClick={resetZoom}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#9333ea', color: 'white', fontWeight: '600', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
            >
              <Maximize2 size={18} />
              Reset Zoom
            </button>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
              <input
                type="checkbox"
                checked={autoYScale}
                onChange={(e) => setAutoYScale(e.target.checked)}
                style={{ width: '1rem', height: '1rem' }}
              />
              Auto Y-axis scale
            </label>
          </div>

          {!autoYScale && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Y Min
                </label>
                <input
                  type="number"
                  value={yMin || ''}
                  onChange={(e) => setYMin(parseFloat(e.target.value) || null)}
                  style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '1rem' }}
                  step="0.1"
                  placeholder="Auto"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Y Max
                </label>
                <input
                  type="number"
                  value={yMax || ''}
                  onChange={(e) => setYMax(parseFloat(e.target.value) || null)}
                  style={{ width: '100%', padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '1rem' }}
                  step="0.1"
                  placeholder="Auto"
                />
              </div>
            </div>
          )}
          
          <div style={{ fontSize: '0.875rem', color: '#4b5563', background: '#f9fafb', padding: '0.75rem', borderRadius: '0.25rem' }}>
            <strong>Supported:</strong> +, -, *, /, ^ (power), sin, cos, tan, sqrt, abs, log, ln, exp, pi, e
            <br />
            <strong>Examples:</strong> x^2, sin(x), x^3 - 2*x + 1, sqrt(x), e^x
          </div>
        </div>
        
        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #f87171', color: '#b91c1c', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}
        
        <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
          <div style={{ width: '100%', height: '500px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="x" 
                  type="number"
                  label={{ value: 'x', position: 'insideBottom', offset: -10 }}
                  domain={['dataMin', 'dataMax']}
                  stroke="#666"
                />
                <YAxis 
                  type="number"
                  label={{ value: 'f(x)', angle: -90, position: 'insideLeft' }}
                  domain={yDomain}
                  stroke="#666"
                />
                <Tooltip 
                  formatter={(value) => parseFloat(value).toFixed(4)}
                  labelFormatter={(label) => `x: ${parseFloat(label).toFixed(4)}`}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
                />
                <ReferenceLine x={0} stroke="#999" strokeDasharray="3 3" />
                <ReferenceLine y={0} stroke="#999" strokeDasharray="3 3" />
                <Line 
                  type="monotone" 
                  dataKey="y" 
                  stroke="#2563eb" 
                  dot={false} 
                  strokeWidth={2}
                  isAnimationActive={false}
                  name="f(x)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
