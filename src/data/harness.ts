export interface ToolGroup {
  category: string;
  blurb: string;
  tools: string[];
}

export interface HarnessGuardrail {
  headline: string;
  body: string;
}

export interface Harness {
  intro: string;
  groups: ToolGroup[];
  guardrails: HarnessGuardrail[];
}

export const harness: Harness = {
  intro:
    "Anvil sits between the AI coding hosts engineers already use and the tools the company already runs. MCP servers wire every agent into source control, CI, artifact stores, test benches, ALM, observability and automotive diagnostics, so an agent answering a question about a failed build reads the actual pipeline log, the actual trace and the actual ticket instead of guessing.",
  groups: [
    {
      category: 'Source control & code review',
      blurb: 'Diffs, merge requests, pipeline status and file content, read directly from the forge.',
      tools: ['GitLab', 'GitHub'],
    },
    {
      category: 'CI / CD',
      blurb: 'Failure diagnosis and pipeline authoring across every CI system in use.',
      tools: ['Zuul', 'Jenkins', 'GitLab CI', 'GitHub Actions'],
    },
    {
      category: 'Artifacts & delivery',
      blurb: 'Version consistency, checksums and stale-artifact checks across repositories.',
      tools: ['Nexus', 'JFrog Artifactory'],
    },
    {
      category: 'ALM, docs & communication',
      blurb: 'Requirements, tickets, specs and status drafts, with publishing and sending human-gated.',
      tools: ['Jira', 'Confluence', 'Microsoft 365 (Outlook)'],
    },
    {
      category: 'Test execution & analysis',
      blurb: 'Bench, HIL and SIL results tied back to requirements and code changes.',
      tools: ['TestGuide', 'Jira test links', 'Jenkins test results'],
    },
    {
      category: 'Traces, logs & captures',
      blurb: 'Read-only analysis of what the ECU and the network actually did.',
      tools: ['DLT traces', 'Wireshark / tshark', 'CAN / CAN-FD logs', 'MDF4 measurements'],
    },
    {
      category: 'Automotive artifacts',
      blurb: 'Calibration, configuration and diagnostic descriptions checked for consistency.',
      tools: ['A2L calibration', 'AUTOSAR ARXML', 'DBC', 'ODX / PDX', 'UDS over DoIP', 'SOME/IP'],
    },
    {
      category: 'Debug & observability',
      blurb: 'Target state from the rig and metrics from production, without write access.',
      tools: ['Lauterbach TRACE32', 'Grafana / Prometheus', 'Elastic', 'Kibana'],
    },
  ],
  guardrails: [
    {
      headline: 'Read-only by default',
      body: 'The analysis agents only query live systems. Actions with side effects, such as retriggering builds, posting reviews, publishing pages or sending mail, are left for a human to approve.',
    },
    {
      headline: 'Risk-tiered tool exposure',
      body: 'A LOW/MEDIUM/HIGH risk cap decides which MCP tools an agent can even see before it runs.',
    },
    {
      headline: 'Registered agents only',
      body: 'On Claude Code a PreToolUse hook blocks any agent spawn that is not in the component registry, and OpenCode gets the same restriction through its native permission map.',
    },
    {
      headline: 'One registry, four hosts',
      body: 'Skills and agents are written once and adapted to each host at install time, so teams do not maintain four toolchains.',
    },
  ],
};
