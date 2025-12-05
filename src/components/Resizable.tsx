'use client'
import React from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"

export default function Resizable() {
  return (
      <PanelGroup
        autoSaveId='example'
        direction='horizontal'
        className='rounded-lg border h-full' // Changed: removed mt-16, min-h-60, added h-full
      >
        {/* Left panel */}
        <Panel defaultSize={25} minSize={10}>
          <div className="panel">1</div>
        </Panel>

        <PanelResizeHandle className="rrp-handle" />

        {/* Right panel split vertically */}
        <Panel defaultSize={75} minSize={10}>
          <PanelGroup direction="vertical" className="h-full w-full">
            <Panel defaultSize={50} minSize={10}>
              <div className="panel">2a</div>
            </Panel>
            <PanelResizeHandle className="rrp-handle-vertical" />
            <Panel defaultSize={50} minSize={10}>
              <div className="panel">2b</div>
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
  )
}