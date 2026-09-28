export interface ToolGroup {
  category: string;
  blurb: string;
  tools: string[];
}

export interface HarnessGuardrail {
  headline: string;
  body: string;
}

export const harness = {
  eyebrow: 'Anvil — the company AI harness',
  headline: 'One harness between the AI coding hosts and every tool the company runs',
  intro:
    "Anvil is the layer that turns a general-purpose AI coding assistant into one that works inside the company's real engineering stack. It packages 150 skills, 150 agents and 62 slash commands, installs them into Claude Code, OpenCode, Beacon and GitHub Copilot from one registry, and connects them through MCP servers to the source control, CI, artifact, test, ALM, observability and automotive-diagnostic tools the teams already use. The agent reads live evidence from those systems; it does not guess.",
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
  ] satisfies ToolGroup[],
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
  ] satisfies HarnessGuardrail[],
};
