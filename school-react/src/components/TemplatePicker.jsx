import React from 'react';
import { useStore, RESULT_TEMPLATES } from '../store/useStore.js';
import { Check, Palette, X } from 'lucide-react';

export default function TemplatePicker({ recordId, onClose, onSelect }) {
  const { records } = useStore();
  const record = records.find((item) => String(item.id) === String(recordId));
  const currentId = record?.templateId || RESULT_TEMPLATES[0].id;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <div>
            <div className="badge badge-accent">Template Selection</div>
            <h3>Select a certificate style</h3>
            <p>Pick a template and the preview will reopen with the selected design.</p>
          </div>

          <button className="icon-button" onClick={onClose} type="button" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="template-scroll-row">
          {RESULT_TEMPLATES.map((template) => {
            const active = currentId === template.id;

            return (
              <button
                key={template.id}
                className={`template-option ${active ? 'active' : ''}`}
                onClick={() => onSelect(recordId, template.id)}
                type="button"
              >
                <div className="template-option-head">
                  <div className="template-option-swatch" style={{ background: template.swatch }}>
                    <Palette size={16} />
                  </div>
                  {active && (
                    <div className="template-option-check">
                      <Check size={12} />
                    </div>
                  )}
                </div>

                <div className="template-option-name">{template.name}</div>
                <div className="template-option-subtitle">
                  {template.id.replace('template-', 'Edition ')}
                </div>
              </button>
            );
          })}
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose} type="button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
