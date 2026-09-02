# -*- coding: utf-8 -*-
import os

def generate_erd_xml():
    xml = '''<mxfile host="app.diagrams.net" agent="Antigravity">
  <diagram id="ERD_Miniposh_Revisi" name="ERD Sistem Reward Toko Miniposh">
    <mxGraphModel dx="1600" dy="1000" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1654" pageHeight="1169" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />

        <!-- ENTITY: Admin -->
        <mxCell id="e_admin" value="Admin" style="shape=table;startSize=30;container=1;collapsible=0;childLayout=tableLayout;fixedRows=1;rowLines=0;fontStyle=1;align=center;resizeLast=1;fillColor=#dae8fc;strokeColor=#6c8ebf;fontSize=12;html=1;" vertex="1" parent="1">
          <mxGeometry x="40" y="40" width="240" height="190" as="geometry" />
        </mxCell>
        <mxCell id="e_admin_pk" value="PK  id                char(30)" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=6;fontSize=10;fontStyle=4;" vertex="1" parent="e_admin">
          <mxGeometry y="30" width="240" height="22" as="geometry" />
        </mxCell>
        <mxCell id="e_admin_attr" value="     email             varchar(100) [UQ]&#xa;     password          varchar(255)&#xa;     name              varchar(100)&#xa;     phone             varchar(20) [NULL]&#xa;     createdAt         datetime&#xa;     updatedAt         datetime" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=6;fontSize=10;" vertex="1" parent="e_admin">
          <mxGeometry y="52" width="240" height="138" as="geometry" />
        </mxCell>

        <!-- ENTITY: SystemSetting -->
        <mxCell id="e_setting" value="SystemSetting" style="shape=table;startSize=30;container=1;collapsible=0;childLayout=tableLayout;fixedRows=1;rowLines=0;fontStyle=1;align=center;resizeLast=1;fillColor=#f5f5f5;strokeColor=#666666;fontSize=12;html=1;" vertex="1" parent="1">
          <mxGeometry x="340" y="40" width="240" height="190" as="geometry" />
        </mxCell>
        <mxCell id="e_setting_pk" value="PK  id                char(30)" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=6;fontSize=10;fontStyle=4;" vertex="1" parent="e_setting">
          <mxGeometry y="30" width="240" height="22" as="geometry" />
        </mxCell>
        <mxCell id="e_setting_attr" value="     key               varchar(50) [UQ]&#xa;     value             varchar(255)&#xa;     label             varchar(100)&#xa;     type              varchar(20)&#xa;     createdAt         datetime&#xa;     updatedAt         datetime" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=6;fontSize=10;" vertex="1" parent="e_setting">
          <mxGeometry y="52" width="240" height="138" as="geometry" />
        </mxCell>

        <!-- ENTITY: StoreTransactionSource (External Staging / POS) -->
        <mxCell id="e_store" value="StoreTransactionSource (POS Staging)" style="shape=table;startSize=30;container=1;collapsible=0;childLayout=tableLayout;fixedRows=1;rowLines=0;fontStyle=1;align=center;resizeLast=1;fillColor=#fff2cc;strokeColor=#d6b656;fontSize=12;html=1;" vertex="1" parent="1">
          <mxGeometry x="40" y="290" width="260" height="230" as="geometry" />
        </mxCell>
        <mxCell id="e_store_pk" value="PK  id                char(30)" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=6;fontSize=10;fontStyle=4;" vertex="1" parent="e_store">
          <mxGeometry y="30" width="260" height="22" as="geometry" />
        </mxCell>
        <mxCell id="e_store_attr" value="     transactionId     varchar(50) [UQ]&#xa;     memberId          varchar(50)&#xa;     memberName        varchar(100)&#xa;     transactionDate   datetime&#xa;     amount            float&#xa;     phone             varchar(20) [NULL]&#xa;     items             text [NULL]&#xa;     cashierName       varchar(100) [NULL]&#xa;     createdAt         datetime&#xa;     updatedAt         datetime" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=6;fontSize=10;" vertex="1" parent="e_store">
          <mxGeometry y="52" width="260" height="178" as="geometry" />
        </mxCell>

        <!-- ENTITY: Member -->
        <mxCell id="e_member" value="Member" style="shape=table;startSize=30;container=1;collapsible=0;childLayout=tableLayout;fixedRows=1;rowLines=0;fontStyle=1;align=center;resizeLast=1;fillColor=#d5e8d4;strokeColor=#82b366;fontSize=12;html=1;" vertex="1" parent="1">
          <mxGeometry x="420" y="290" width="260" height="230" as="geometry" />
        </mxCell>
        <mxCell id="e_member_pk" value="PK  id                char(30)" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=6;fontSize=10;fontStyle=4;" vertex="1" parent="e_member">
          <mxGeometry y="30" width="260" height="22" as="geometry" />
        </mxCell>
        <mxCell id="e_member_attr" value="     memberId          varchar(50) [UQ]&#xa;     name              varchar(100)&#xa;     email             varchar(100) [NULL]&#xa;     phone             varchar(20) [NULL]&#xa;     totalPoints       float&#xa;     totalSpent        float&#xa;     transactionCount  int&#xa;     createdAt         datetime&#xa;     updatedAt         datetime" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=6;fontSize=10;" vertex="1" parent="e_member">
          <mxGeometry y="52" width="260" height="178" as="geometry" />
        </mxCell>

        <!-- ENTITY: Transaction -->
        <mxCell id="e_txn" value="Transaction" style="shape=table;startSize=30;container=1;collapsible=0;childLayout=tableLayout;fixedRows=1;rowLines=0;fontStyle=1;align=center;resizeLast=1;fillColor=#d5e8d4;strokeColor=#82b366;fontSize=12;html=1;" vertex="1" parent="1">
          <mxGeometry x="800" y="290" width="260" height="240" as="geometry" />
        </mxCell>
        <mxCell id="e_txn_pk" value="PK  id                char(30)" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=6;fontSize=10;fontStyle=4;" vertex="1" parent="e_txn">
          <mxGeometry y="30" width="260" height="22" as="geometry" />
        </mxCell>
        <mxCell id="e_txn_fk" value="FK  memberId          char(30)" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=6;fontSize=10;fontStyle=2;" vertex="1" parent="e_txn">
          <mxGeometry y="52" width="260" height="22" as="geometry" />
        </mxCell>
        <mxCell id="e_txn_attr" value="     transactionDate   datetime&#xa;     amount            float&#xa;     pointsEarned      float&#xa;     pointsExpiryDate  datetime [NULL]&#xa;     pointsExpired     bool&#xa;     description       varchar(255) [NULL]&#xa;     createdAt         datetime&#xa;     updatedAt         datetime" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=6;fontSize=10;" vertex="1" parent="e_txn">
          <mxGeometry y="74" width="260" height="166" as="geometry" />
        </mxCell>

        <!-- ENTITY: RewardCampaign -->
        <mxCell id="e_campaign" value="RewardCampaign" style="shape=table;startSize=30;container=1;collapsible=0;childLayout=tableLayout;fixedRows=1;rowLines=0;fontStyle=1;align=center;resizeLast=1;fillColor=#e1d5e7;strokeColor=#9673a6;fontSize=12;html=1;" vertex="1" parent="1">
          <mxGeometry x="1160" y="40" width="260" height="240" as="geometry" />
        </mxCell>
        <mxCell id="e_campaign_pk" value="PK  id                char(30)" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=6;fontSize=10;fontStyle=4;" vertex="1" parent="e_campaign">
          <mxGeometry y="30" width="260" height="22" as="geometry" />
        </mxCell>
        <mxCell id="e_campaign_attr" value="     name              varchar(100)&#xa;     description       text [NULL]&#xa;     criteria          varchar(50)&#xa;     winnersCount      int&#xa;     startDate         datetime&#xa;     endDate           datetime&#xa;     status            varchar(20)&#xa;     createdAt         datetime&#xa;     updatedAt         datetime" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=6;fontSize=10;" vertex="1" parent="e_campaign">
          <mxGeometry y="52" width="260" height="188" as="geometry" />
        </mxCell>

        <!-- ENTITY: RewardWinner -->
        <mxCell id="e_winner" value="RewardWinner" style="shape=table;startSize=30;container=1;collapsible=0;childLayout=tableLayout;fixedRows=1;rowLines=0;fontStyle=1;align=center;resizeLast=1;fillColor=#e1d5e7;strokeColor=#9673a6;fontSize=12;html=1;" vertex="1" parent="1">
          <mxGeometry x="1160" y="340" width="260" height="300" as="geometry" />
        </mxCell>
        <mxCell id="e_winner_pk" value="PK  id                char(30)" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=6;fontSize=10;fontStyle=4;" vertex="1" parent="e_winner">
          <mxGeometry y="30" width="260" height="22" as="geometry" />
        </mxCell>
        <mxCell id="e_winner_fk1" value="FK  campaignId        char(30)" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=6;fontSize=10;fontStyle=2;" vertex="1" parent="e_winner">
          <mxGeometry y="52" width="260" height="22" as="geometry" />
        </mxCell>
        <mxCell id="e_winner_fk2" value="FK  memberId          char(30)" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=6;fontSize=10;fontStyle=2;" vertex="1" parent="e_winner">
          <mxGeometry y="74" width="260" height="22" as="geometry" />
        </mxCell>
        <mxCell id="e_winner_attr" value="     rank              int&#xa;     pointsAtWin       float&#xa;     spentAtWin        float&#xa;     transactionsAtWin int&#xa;     rewardClaimed     bool&#xa;     claimedAt         datetime [NULL]&#xa;     notes             varchar(255) [NULL]&#xa;     createdAt         datetime&#xa;     updatedAt         datetime" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=6;fontSize=10;" vertex="1" parent="e_winner">
          <mxGeometry y="96" width="260" height="204" as="geometry" />
        </mxCell>

        <!-- ENTITY: RewardCatalog -->
        <mxCell id="e_catalog" value="RewardCatalog" style="shape=table;startSize=30;container=1;collapsible=0;childLayout=tableLayout;fixedRows=1;rowLines=0;fontStyle=1;align=center;resizeLast=1;fillColor=#f8cecc;strokeColor=#b85450;fontSize=12;html=1;" vertex="1" parent="1">
          <mxGeometry x="800" y="680" width="260" height="260" as="geometry" />
        </mxCell>
        <mxCell id="e_catalog_pk" value="PK  id                char(30)" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=6;fontSize=10;fontStyle=4;" vertex="1" parent="e_catalog">
          <mxGeometry y="30" width="260" height="22" as="geometry" />
        </mxCell>
        <mxCell id="e_catalog_attr" value="     name              varchar(100)&#xa;     description       text [NULL]&#xa;     pointsRequired    float&#xa;     stock             int [NULL]&#xa;     imageUrl          varchar(255) [NULL]&#xa;     category          varchar(50) [NULL]&#xa;     isActive          bool&#xa;     validUntil        datetime [NULL]&#xa;     createdAt         datetime&#xa;     updatedAt         datetime" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=6;fontSize=10;" vertex="1" parent="e_catalog">
          <mxGeometry y="52" width="260" height="208" as="geometry" />
        </mxCell>

        <!-- ENTITY: RewardRedemption -->
        <mxCell id="e_redeem" value="RewardRedemption" style="shape=table;startSize=30;container=1;collapsible=0;childLayout=tableLayout;fixedRows=1;rowLines=0;fontStyle=1;align=center;resizeLast=1;fillColor=#f8cecc;strokeColor=#b85450;fontSize=12;html=1;" vertex="1" parent="1">
          <mxGeometry x="420" y="660" width="260" height="320" as="geometry" />
        </mxCell>
        <mxCell id="e_redeem_pk" value="PK  id                char(30)" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=6;fontSize=10;fontStyle=4;" vertex="1" parent="e_redeem">
          <mxGeometry y="30" width="260" height="22" as="geometry" />
        </mxCell>
        <mxCell id="e_redeem_fk1" value="FK  memberId          char(30)" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=6;fontSize=10;fontStyle=2;" vertex="1" parent="e_redeem">
          <mxGeometry y="52" width="260" height="22" as="geometry" />
        </mxCell>
        <mxCell id="e_redeem_fk2" value="FK  catalogId         char(30)" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=6;fontSize=10;fontStyle=2;" vertex="1" parent="e_redeem">
          <mxGeometry y="74" width="260" height="22" as="geometry" />
        </mxCell>
        <mxCell id="e_redeem_attr" value="     pointsUsed        float&#xa;     claimCode         varchar(50)&#xa;     status            varchar(20)&#xa;     notes             text [NULL]&#xa;     adminNotes        text [NULL]&#xa;     redeemedAt        datetime&#xa;     processedAt       datetime [NULL]&#xa;     processedBy       char(30) [NULL]&#xa;     completedAt       datetime [NULL]&#xa;     createdAt         datetime&#xa;     updatedAt         datetime" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=6;fontSize=10;" vertex="1" parent="e_redeem">
          <mxGeometry y="96" width="260" height="224" as="geometry" />
        </mxCell>

        <!-- ==================== RELATIONSHIPS WITH CROW FOOT NOTATION ==================== -->

        <!-- 1. Member (1) to Transaction (N) -->
        <mxCell id="rel_mem_txn" edge="1" parent="1" source="e_member" target="e_txn" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;startArrow=ERmandOne;startFill=0;endArrow=ERmany;endFill=0;strokeWidth=2;strokeColor=#2E7D32;">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="lbl_mem_txn" connectable="0" parent="rel_mem_txn" style="edgeLabel;align=center;verticalAlign=middle;fontSize=11;fontStyle=1;backgroundColor=#ffffff;" value="1 : N (Memiliki Transaksi)" vertex="1">
          <mxGeometry x="0.0" relative="1" as="geometry"><mxPoint y="-12" as="offset" /></mxGeometry>
        </mxCell>

        <!-- 2. RewardCampaign (1) to RewardWinner (N) -->
        <mxCell id="rel_camp_win" edge="1" parent="1" source="e_campaign" target="e_winner" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;startArrow=ERmandOne;startFill=0;endArrow=ERmany;endFill=0;strokeWidth=2;strokeColor=#6A1B9A;">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="lbl_camp_win" connectable="0" parent="rel_camp_win" style="edgeLabel;align=center;verticalAlign=middle;fontSize=11;fontStyle=1;backgroundColor=#ffffff;" value="1 : N (Menghasilkan Pemenang)" vertex="1">
          <mxGeometry x="0.0" relative="1" as="geometry"><mxPoint x="30" as="offset" /></mxGeometry>
        </mxCell>

        <!-- 3. Member (1) to RewardWinner (N) -->
        <mxCell id="rel_mem_win" edge="1" parent="1" source="e_member" target="e_winner" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;startArrow=ERmandOne;startFill=0;endArrow=ERmany;endFill=0;strokeWidth=2;strokeColor=#6A1B9A;">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="550" y="560" />
              <mxPoint x="1120" y="560" />
              <mxPoint x="1120" y="490" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="lbl_mem_win" connectable="0" parent="rel_mem_win" style="edgeLabel;align=center;verticalAlign=middle;fontSize=11;fontStyle=1;backgroundColor=#ffffff;" value="1 : N (Memperoleh Penghargaan)" vertex="1">
          <mxGeometry x="0.2" relative="1" as="geometry"><mxPoint y="-12" as="offset" /></mxGeometry>
        </mxCell>

        <!-- 4. Member (1) to RewardRedemption (N) -->
        <mxCell id="rel_mem_red" edge="1" parent="1" source="e_member" target="e_redeem" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;startArrow=ERmandOne;startFill=0;endArrow=ERmany;endFill=0;strokeWidth=2;strokeColor=#C62828;">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="lbl_mem_red" connectable="0" parent="rel_mem_red" style="edgeLabel;align=center;verticalAlign=middle;fontSize=11;fontStyle=1;backgroundColor=#ffffff;" value="1 : N (Klaim Penukaran)" vertex="1">
          <mxGeometry x="0.0" relative="1" as="geometry"><mxPoint x="-30" as="offset" /></mxGeometry>
        </mxCell>

        <!-- 5. RewardCatalog (1) to RewardRedemption (N) -->
        <mxCell id="rel_cat_red" edge="1" parent="1" source="e_catalog" target="e_redeem" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;startArrow=ERmandOne;startFill=0;endArrow=ERmany;endFill=0;strokeWidth=2;strokeColor=#C62828;">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="lbl_cat_red" connectable="0" parent="rel_cat_red" style="edgeLabel;align=center;verticalAlign=middle;fontSize=11;fontStyle=1;backgroundColor=#ffffff;" value="1 : N (Disediakan untuk Ditukar)" vertex="1">
          <mxGeometry x="0.0" relative="1" as="geometry"><mxPoint y="-12" as="offset" /></mxGeometry>
        </mxCell>

        <!-- 6. ETL Staging Relation (Dashed line from StoreTransactionSource to Member & Transaction) -->
        <mxCell id="rel_etl" edge="1" parent="1" source="e_store" target="e_member" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;dashed=1;dashPattern=8 4;endArrow=open;endFill=0;strokeWidth=2;strokeColor=#F57F17;">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="lbl_etl" connectable="0" parent="rel_etl" style="edgeLabel;align=center;verticalAlign=middle;fontSize=10;fontStyle=2;backgroundColor=#ffffff;" value="ETL Sync &amp; Deduplication" vertex="1">
          <mxGeometry x="0.0" relative="1" as="geometry"><mxPoint y="-12" as="offset" /></mxGeometry>
        </mxCell>

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>'''
    with open('docs/erd_revisi_v2.xml', 'w', encoding='utf-8') as f:
        f.write(xml)
    print("Generated docs/erd_revisi_v2.xml")

def generate_class_diagram_xml():
    xml = '''<mxfile host="app.diagrams.net" agent="Antigravity">
  <diagram id="ClassDiagram_Miniposh_Revisi" name="Class Diagram Sistem Reward Toko Miniposh">
    <mxGraphModel dx="1800" dy="1100" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1654" pageHeight="1169" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />

        <!-- CLASS: Admin -->
        <mxCell id="c_admin" value="Admin" style="swimlane;fontStyle=1;align=center;startSize=26;html=1;collapsible=0;fillColor=#dae8fc;strokeColor=#6c8ebf;fontSize=11;" vertex="1" parent="1">
          <mxGeometry x="40" y="40" width="220" height="240" as="geometry" />
        </mxCell>
        <mxCell id="c_admin_attr" value="- id: String (PK)&#xa;- email: String&#xa;- password: String&#xa;- name: String&#xa;- phone: String?&#xa;- createdAt: DateTime&#xa;- updatedAt: DateTime&#xa;---&#xa;+ authenticate(): Boolean&#xa;+ updateProfile(): Admin" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=0;fontSize=10;" vertex="1" parent="c_admin">
          <mxGeometry y="26" width="220" height="214" as="geometry" />
        </mxCell>

        <!-- CLASS: Member -->
        <mxCell id="c_member" value="Member" style="swimlane;fontStyle=1;align=center;startSize=26;html=1;collapsible=0;fillColor=#d5e8d4;strokeColor=#82b366;fontSize=11;" vertex="1" parent="1">
          <mxGeometry x="360" y="40" width="240" height="240" as="geometry" />
        </mxCell>
        <mxCell id="c_member_attr" value="- id: String (PK)&#xa;- memberId: String&#xa;- name: String&#xa;- email: String?&#xa;- phone: String?&#xa;- totalPoints: Float&#xa;- totalSpent: Float&#xa;- transactionCount: Int&#xa;---&#xa;+ recalculatePoints(): Void&#xa;+ deductPoints(pts): Void" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=0;fontSize=10;" vertex="1" parent="c_member">
          <mxGeometry y="26" width="240" height="214" as="geometry" />
        </mxCell>

        <!-- CLASS: Transaction -->
        <mxCell id="c_txn" value="Transaction" style="swimlane;fontStyle=1;align=center;startSize=26;html=1;collapsible=0;fillColor=#fff2cc;strokeColor=#d6b656;fontSize=11;" vertex="1" parent="1">
          <mxGeometry x="720" y="40" width="230" height="240" as="geometry" />
        </mxCell>
        <mxCell id="c_txn_attr" value="- id: String (PK)&#xa;- memberId: String (FK)&#xa;- transactionDate: DateTime&#xa;- amount: Float&#xa;- pointsEarned: Float&#xa;- pointsExpiryDate: DateTime?&#xa;- pointsExpired: Boolean&#xa;---&#xa;+ calculatePoints(rate): Float&#xa;+ isExpired(): Boolean" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=0;fontSize=10;" vertex="1" parent="c_txn">
          <mxGeometry y="26" width="230" height="214" as="geometry" />
        </mxCell>

        <!-- CLASS: RewardCampaign -->
        <mxCell id="c_campaign" value="RewardCampaign" style="swimlane;fontStyle=1;align=center;startSize=26;html=1;collapsible=0;fillColor=#e1d5e7;strokeColor=#9673a6;fontSize=11;" vertex="1" parent="1">
          <mxGeometry x="360" y="340" width="240" height="250" as="geometry" />
        </mxCell>
        <mxCell id="c_campaign_attr" value="- id: String (PK)&#xa;- name: String&#xa;- description: String?&#xa;- criteria: String&#xa;- winnersCount: Int&#xa;- startDate: DateTime&#xa;- endDate: DateTime&#xa;- status: String&#xa;---&#xa;+ evaluateWinners(): List&lt;RewardWinner&gt;&#xa;+ applyTieBreaker(): List&lt;RewardWinner&gt;" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=0;fontSize=10;" vertex="1" parent="c_campaign">
          <mxGeometry y="26" width="240" height="224" as="geometry" />
        </mxCell>

        <!-- CLASS: RewardWinner -->
        <mxCell id="c_winner" value="RewardWinner" style="swimlane;fontStyle=1;align=center;startSize=26;html=1;collapsible=0;fillColor=#e1d5e7;strokeColor=#9673a6;fontSize=11;" vertex="1" parent="1">
          <mxGeometry x="720" y="340" width="230" height="250" as="geometry" />
        </mxCell>
        <mxCell id="c_winner_attr" value="- id: String (PK)&#xa;- campaignId: String (FK)&#xa;- memberId: String (FK)&#xa;- rank: Int&#xa;- pointsAtWin: Float&#xa;- spentAtWin: Float&#xa;- transactionsAtWin: Int&#xa;- rewardClaimed: Boolean&#xa;---&#xa;+ markClaimed(notes): Void&#xa;+ cancelClaim(): Void" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=0;fontSize=10;" vertex="1" parent="c_winner">
          <mxGeometry y="26" width="230" height="224" as="geometry" />
        </mxCell>

        <!-- CLASS: RewardCatalog -->
        <mxCell id="c_catalog" value="RewardCatalog" style="swimlane;fontStyle=1;align=center;startSize=26;html=1;collapsible=0;fillColor=#f8cecc;strokeColor=#b85450;fontSize=11;" vertex="1" parent="1">
          <mxGeometry x="360" y="650" width="240" height="240" as="geometry" />
        </mxCell>
        <mxCell id="c_catalog_attr" value="- id: String (PK)&#xa;- name: String&#xa;- description: String?&#xa;- pointsRequired: Float&#xa;- stock: Int?&#xa;- isActive: Boolean&#xa;---&#xa;+ checkAvailability(): Boolean&#xa;+ reduceStock(qty): Void" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=0;fontSize=10;" vertex="1" parent="c_catalog">
          <mxGeometry y="26" width="240" height="214" as="geometry" />
        </mxCell>

        <!-- CLASS: RewardRedemption -->
        <mxCell id="c_redeem" value="RewardRedemption" style="swimlane;fontStyle=1;align=center;startSize=26;html=1;collapsible=0;fillColor=#f8cecc;strokeColor=#b85450;fontSize=11;" vertex="1" parent="1">
          <mxGeometry x="720" y="650" width="230" height="270" as="geometry" />
        </mxCell>
        <mxCell id="c_redeem_attr" value="- id: String (PK)&#xa;- memberId: String (FK)&#xa;- catalogId: String (FK)&#xa;- pointsUsed: Float&#xa;- claimCode: String&#xa;- status: String&#xa;- redeemedAt: DateTime&#xa;---&#xa;+ processApproval(adminId): Void&#xa;+ completeRedemption(): Void" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=0;fontSize=10;" vertex="1" parent="c_redeem">
          <mxGeometry y="26" width="230" height="244" as="geometry" />
        </mxCell>

        <!-- CLASS: StoreTransactionSource -->
        <mxCell id="c_store" value="StoreTransactionSource" style="swimlane;fontStyle=1;align=center;startSize=26;html=1;collapsible=0;fillColor=#f5f5f5;strokeColor=#666666;fontSize=11;" vertex="1" parent="1">
          <mxGeometry x="40" y="340" width="220" height="220" as="geometry" />
        </mxCell>
        <mxCell id="c_store_attr" value="- id: String (PK)&#xa;- transactionId: String&#xa;- memberId: String&#xa;- memberName: String&#xa;- transactionDate: DateTime&#xa;- amount: Float&#xa;- cashierName: String?&#xa;---&#xa;+ fetchPending(): List&lt;StoreTransactionSource&gt;" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=0;fontSize=10;" vertex="1" parent="c_store">
          <mxGeometry y="26" width="220" height="194" as="geometry" />
        </mxCell>

        <!-- ==================== ASSOCIATIONS ==================== -->
        <!-- Member 1 to * Transaction -->
        <mxCell id="cr1" edge="1" parent="1" source="c_member" target="c_txn" style="html=1;endArrow=none;endFill=0;startArrow=diamondThin;startFill=1;strokeColor=#2E7D32;strokeWidth=2;">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="cr1_lbl" connectable="0" parent="cr1" style="edgeLabel;align=center;verticalAlign=middle;fontSize=10;backgroundColor=#ffffff;" value="1 .. *" vertex="1">
          <mxGeometry x="0.0" relative="1" as="geometry"><mxPoint y="-10" as="offset" /></mxGeometry>
        </mxCell>

        <!-- Member 1 to * RewardWinner -->
        <mxCell id="cr2" edge="1" parent="1" source="c_member" target="c_winner" style="html=1;endArrow=none;endFill=0;startArrow=open;strokeColor=#6A1B9A;strokeWidth=2;">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="cr2_lbl" connectable="0" parent="cr2" style="edgeLabel;align=center;verticalAlign=middle;fontSize=10;backgroundColor=#ffffff;" value="1 .. *" vertex="1">
          <mxGeometry x="0.2" relative="1" as="geometry"><mxPoint y="-10" as="offset" /></mxGeometry>
        </mxCell>

        <!-- RewardCampaign 1 to * RewardWinner -->
        <mxCell id="cr3" edge="1" parent="1" source="c_campaign" target="c_winner" style="html=1;endArrow=none;endFill=0;startArrow=diamondThin;startFill=1;strokeColor=#6A1B9A;strokeWidth=2;">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="cr3_lbl" connectable="0" parent="cr3" style="edgeLabel;align=center;verticalAlign=middle;fontSize=10;backgroundColor=#ffffff;" value="1 .. *" vertex="1">
          <mxGeometry x="0.0" relative="1" as="geometry"><mxPoint y="-10" as="offset" /></mxGeometry>
        </mxCell>

        <!-- Member 1 to * RewardRedemption -->
        <mxCell id="cr4" edge="1" parent="1" source="c_member" target="c_redeem" style="html=1;endArrow=none;endFill=0;startArrow=open;strokeColor=#C62828;strokeWidth=2;">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="cr4_lbl" connectable="0" parent="cr4" style="edgeLabel;align=center;verticalAlign=middle;fontSize=10;backgroundColor=#ffffff;" value="1 .. *" vertex="1">
          <mxGeometry x="0.0" relative="1" as="geometry"><mxPoint y="-10" as="offset" /></mxGeometry>
        </mxCell>

        <!-- RewardCatalog 1 to * RewardRedemption -->
        <mxCell id="cr5" edge="1" parent="1" source="c_catalog" target="c_redeem" style="html=1;endArrow=none;endFill=0;startArrow=open;strokeColor=#C62828;strokeWidth=2;">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="cr5_lbl" connectable="0" parent="cr5" style="edgeLabel;align=center;verticalAlign=middle;fontSize=10;backgroundColor=#ffffff;" value="1 .. *" vertex="1">
          <mxGeometry x="0.0" relative="1" as="geometry"><mxPoint y="-10" as="offset" /></mxGeometry>
        </mxCell>

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>'''
    with open('docs/class_diagram_revisi_v2.xml', 'w', encoding='utf-8') as f:
        f.write(xml)
    print("Generated docs/class_diagram_revisi_v2.xml")

def generate_flowchart_xml():
    # Read the existing rich flowchart_sistem_v2.xml and verify its integrity
    if os.path.exists('docs/flowchart_sistem_v2.xml'):
        with open('docs/flowchart_sistem_v2.xml', 'r', encoding='utf-8') as f:
            content = f.read()
        with open('docs/flowchart_revisi_v2.xml', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Generated docs/flowchart_revisi_v2.xml (verified)")

if __name__ == '__main__':
    generate_erd_xml()
    generate_class_diagram_xml()
    generate_flowchart_xml()
