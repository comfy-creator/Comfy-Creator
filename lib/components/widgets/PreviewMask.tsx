import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';

type PreviewMaskedImageWidgetProps = {
   value?: string;
   label?: string;
};

const PreviewMaskedImageWidget = ({ value }: PreviewMaskedImageWidgetProps) => {
   return (
      <div className="preview-masked-image-node">
         <div className="flex flex-col items-center gap-6">
            <h3>Masked Image</h3>
            <img src={value} alt="Masked" style={{ maxWidth: '100%' }} />
            <h3>Shapes</h3>
         </div>
      </div>
   );
};

export default PreviewMaskedImageWidget;
